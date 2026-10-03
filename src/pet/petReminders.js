import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PET_CONFIG, projectEvents } from './petLogic';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const REMINDER_CONFIG = {
  quietStartHour: 22,
  quietEndHour: 8,
  maxPerDay: 3,
  mergeWindowMs: 90 * MINUTE,
  horizonMs: 6 * DAY,
  finalWarningMs: 2 * HOUR,
  minLeadMs: 2 * MINUTE,
  // Pet reminders own ids 2001-2099. The streak reminder uses 1001 and is never touched here.
  idBase: 2000,
  idSpan: 100,
};

const KEY_ENABLED = 'spritedex_pet_reminders';
const KEY_LOG = 'spritedex_pet_reminder_log';

const NEED_ORDER = ['hunger', 'cleanliness', 'happiness', 'energy'];
const NEED_PHRASE = { hunger: 'getting hungry', cleanliness: 'getting dirty', happiness: 'feeling bored', energy: 'getting sleepy' };
const CAUSE_HINT = { starvation: 'It needs food.', illness: 'It needs medicine.', neglect: 'It needs care.' };

const hourOf = (ms) => new Date(ms).getHours();
const isQuiet = (ms) => hourOf(ms) >= REMINDER_CONFIG.quietStartHour || hourOf(ms) < REMINDER_CONFIG.quietEndHour;
const atHour = (ms, hour, dayOffset = 0) => {
  const d = new Date(ms);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, 0, 0, 0);
  return d.getTime();
};
const quietEndAfter = (ms) => (hourOf(ms) >= REMINDER_CONFIG.quietStartHour ? atHour(ms, REMINDER_CONFIG.quietEndHour, 1) : atHour(ms, REMINDER_CONFIG.quietEndHour));
// Half an hour before quiet hours begin, so a moved-earlier reminder never sits on the boundary.
const quietStartBefore = (ms) => {
  const start = hourOf(ms) < REMINDER_CONFIG.quietEndHour ? atHour(ms, REMINDER_CONFIG.quietStartHour, -1) : atHour(ms, REMINDER_CONFIG.quietStartHour);
  return start - 30 * MINUTE;
};
const dayKey = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const hoursText = (ms) => {
  const h = Math.max(1, Math.round(ms / HOUR));
  return h === 1 ? 'about an hour' : `about ${h} hours`;
};
const joinList = (items) => (items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`);

function compose(reminder, ctx) {
  const { name, deathAtMs, cause, sickDeadlineMs } = ctx;
  const hint = CAUSE_HINT[cause] || CAUSE_HINT.neglect;
  switch (reminder.kind) {
    case 'need': {
      const phrases = NEED_ORDER.filter((n) => reminder.needs.includes(n)).map((n) => NEED_PHRASE[n]);
      return { title: `${name} needs you`, body: `${name} is ${joinList(phrases)}. Take a minute to look after it.` };
    }
    case 'sick':
      return { title: `${name} is sick`, body: `Give it medicine within ${hoursText(sickDeadlineMs - reminder.atMs)} or it may not recover.` };
    case 'critical':
      return { title: `${name}'s health is critical`, body: 'Its health is dropping fast. Look after it soon.' };
    case 'lastChance':
      return { title: `${name} is running out of time`, body: `${name} may only have ${hoursText(deathAtMs - reminder.atMs)} left without care. ${hint}` };
    default:
      return { title: `${name} is almost out of time`, body: `Without care, ${name} will pass away in ${hoursText(deathAtMs - reminder.atMs)}. ${hint}` };
  }
}

// Decides which reminders to schedule. Pure: same pet and clock in, same plan out.
export function planReminders({ pet, spriteName = 'Your Sprite', nowMs, firedTimes = [] }) {
  if (!pet || pet.endedAt != null) return [];
  const projection = projectEvents(pet, nowMs);
  if (!projection) return [];

  const cfg = REMINDER_CONFIG;
  const { deathAtMs, cause, sickDeadlineMs } = projection;
  const earliest = nowMs + cfg.minLeadMs;
  const horizon = nowMs + cfg.horizonMs;

  const events = [];
  for (const need of NEED_ORDER) {
    if (projection.lowAt[need] != null) events.push({ kind: 'need', need, atMs: projection.lowAt[need], priority: 1 });
  }
  if (projection.sickAtMs != null) events.push({ kind: 'sick', atMs: projection.sickAtMs, priority: 3 });
  if (projection.criticalAtMs != null) events.push({ kind: 'critical', atMs: projection.criticalAtMs, priority: 3 });
  if (deathAtMs != null) {
    events.push({ kind: 'lastChance', atMs: deathAtMs - PET_CONFIG.warn.lastChanceMs, priority: 4 });
    events.push({ kind: 'finalWarning', atMs: deathAtMs - cfg.finalWarningMs, priority: 5 });
  }

  // Quiet hours. A report of something that has happened can only move later. A
  // countdown warning can move earlier, because its text is worked out for the send time.
  const placed = [];
  for (const event of events) {
    let at = event.atMs;
    if (isQuiet(at)) {
      if (event.kind === 'lastChance' || event.kind === 'finalWarning') {
        const before = quietStartBefore(at);
        const after = quietEndAfter(at);
        const afterIsUseful = deathAtMs != null && after <= deathAtMs - 45 * MINUTE;
        // The final warning is only worth sending close to the end, so it prefers the morning.
        if (event.kind === 'finalWarning' && afterIsUseful) at = after;
        else if (before >= earliest) at = before;
        else if (afterIsUseful) at = after;
      } else {
        at = quietEndAfter(at);
        if (deathAtMs != null && at >= deathAtMs - 10 * MINUTE) continue;
      }
    }
    if (at < earliest || at > horizon) continue;
    placed.push({ ...event, atMs: at });
  }

  // Two countdown warnings a few hours apart say the same thing, so keep the later one.
  const lastChance = placed.find((e) => e.kind === 'lastChance');
  const finalWarning = placed.find((e) => e.kind === 'finalWarning');
  if (lastChance && finalWarning && finalWarning.atMs - lastChance.atMs < 3 * HOUR) {
    placed.splice(placed.indexOf(lastChance), 1);
  }

  // Needs that run low close together become one notification.
  const merged = [];
  for (const event of placed.filter((e) => e.kind === 'need').sort((a, b) => a.atMs - b.atMs)) {
    const last = merged[merged.length - 1];
    if (last && event.atMs - last.atMs <= cfg.mergeWindowMs) last.needs.push(event.need);
    else merged.push({ kind: 'need', atMs: event.atMs, priority: 1, needs: [event.need] });
  }
  const all = [...merged, ...placed.filter((e) => e.kind !== 'need')];

  // At most maxPerDay per calendar day, counting ones that already went out today.
  const alreadySent = firedTimes.filter((t) => t <= nowMs);
  const byDay = new Map();
  for (const reminder of all) {
    const key = dayKey(reminder.atMs);
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(reminder);
  }
  const kept = [];
  for (const [key, list] of byDay) {
    const used = alreadySent.filter((t) => dayKey(t) === key).length;
    list.sort((a, b) => b.priority - a.priority || a.atMs - b.atMs);
    kept.push(...list.slice(0, Math.max(0, cfg.maxPerDay - used)));
  }

  const ctx = { name: spriteName, deathAtMs, cause, sickDeadlineMs };
  return kept
    .sort((a, b) => a.atMs - b.atMs)
    .map((reminder) => ({ atMs: Math.round(reminder.atMs), kind: reminder.kind, ...compose(reminder, ctx) }));
}

// The phone-facing part. Everything it touches is injected, so tests can use fakes.
export function createReminderService({ plugin, isNative, storage, now = () => Date.now() }) {
  const cfg = REMINDER_CONFIG;
  let runner = null;
  let pending = null;

  const read = (key) => {
    try { return storage.getItem(key); } catch { return null; }
  };
  const write = (key, value) => {
    try { storage.setItem(key, value); } catch { /* reminders still work without storage */ }
  };

  const isEnabled = () => read(KEY_ENABLED) !== '0';
  const setEnabled = (on) => write(KEY_ENABLED, on ? '1' : '0');
  const loadLog = () => {
    try {
      const value = JSON.parse(read(KEY_LOG));
      return Array.isArray(value) ? value.filter(Number.isFinite) : [];
    } catch {
      return [];
    }
  };

  async function permission() {
    if (!isNative()) return 'unsupported';
    try { return (await plugin.checkPermissions()).display; } catch { return 'unsupported'; }
  }

  async function requestPermission() {
    if (!isNative()) return 'unsupported';
    try {
      let status = await plugin.checkPermissions();
      if (status.display === 'prompt' || status.display === 'prompt-with-rationale') status = await plugin.requestPermissions();
      return status.display;
    } catch {
      return 'denied';
    }
  }

  async function getStatus() {
    return { supported: isNative(), enabled: isEnabled(), permission: await permission() };
  }

  async function runSync({ pet, spriteName }) {
    if (!isNative()) return;

    const { notifications } = await plugin.getPending();
    const mine = notifications.filter((n) => n.id > cfg.idBase && n.id < cfg.idBase + cfg.idSpan);
    if (mine.length > 0) await plugin.cancel({ notifications: mine.map((n) => ({ id: n.id })) });

    const nowMs = now();
    const fired = loadLog().filter((t) => t <= nowMs && t > nowMs - 2 * DAY);
    write(KEY_LOG, JSON.stringify(fired));
    if (!isEnabled() || !pet) return;
    if ((await permission()) !== 'granted') return;

    const plan = planReminders({ pet, spriteName, nowMs, firedTimes: fired });
    if (plan.length === 0) return;

    await plugin.schedule({
      notifications: plan.map((reminder, i) => ({
        id: cfg.idBase + 1 + i,
        title: reminder.title,
        body: reminder.body,
        schedule: { at: new Date(reminder.atMs), allowWhileIdle: true },
        extra: { route: 'pet' },
      })),
    });
    write(KEY_LOG, JSON.stringify([...fired, ...plan.map((r) => r.atMs)]));
  }

  // For checking delivery on a real phone. Uses id 2100, just outside the range sync() manages,
  // so a re-plan in the next minute cannot cancel it.
  async function scheduleTest(spriteName) {
    if (!isNative()) return 'Reminders only work in the iOS and Android apps.';
    const status = await requestPermission();
    if (status !== 'granted') return 'Notifications are blocked. Turn them on in your phone settings first.';
    try {
      await plugin.schedule({
        notifications: [{
          id: cfg.idBase + cfg.idSpan,
          title: `${spriteName || 'Your Sprite'} says hi`,
          body: 'Test reminder. Pet reminders are working on this device.',
          schedule: { at: new Date(now() + MINUTE), allowWhileIdle: true },
          extra: { route: 'pet' },
        }],
      });
      return 'Test reminder set for 1 minute from now. Lock your phone or switch apps to see it.';
    } catch {
      return 'Could not schedule the test reminder.';
    }
  }

  // Calls can pile up (every snapshot, every resume). Only the newest state matters,
  // and runs never overlap, so an older plan can never overwrite a newer one.
  function sync(pet, spriteName) {
    pending = { pet, spriteName };
    if (!runner) {
      runner = (async () => {
        while (pending) {
          const job = pending;
          pending = null;
          try {
            await runSync(job);
          } catch (e) {
            console.error('Pet reminder sync failed', e);
          }
        }
      })().finally(() => { runner = null; });
    }
    return runner;
  }

  return { sync, getStatus, requestPermission, setEnabled, isEnabled, scheduleTest };
}

const browserStorage = (() => {
  try { return window.localStorage; } catch { return null; }
})();

const service = createReminderService({
  plugin: LocalNotifications,
  isNative: () => Capacitor.isNativePlatform(),
  storage: browserStorage,
});

export const syncPetReminders = service.sync;
export const getReminderStatus = service.getStatus;
export const requestReminderPermission = service.requestPermission;
export const setRemindersEnabled = service.setEnabled;
export const scheduleTestReminder = service.scheduleTest;
