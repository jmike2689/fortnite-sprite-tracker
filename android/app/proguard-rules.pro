# --- CAPACITOR & CORDOVA RULES ---
-keep class com.getcapacitor.** { *; }
-keep public class * extends com.getcapacitor.Plugin
-keep class org.apache.cordova.** { *; }
-keep public class * extends org.apache.cordova.CordovaPlugin

# --- FIREBASE & GOOGLE SERVICES ---
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }

# Suppress missing class warnings for optional Firebase KTX / SDK references
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**
-dontwarn com.getcapacitor.**
-dontwarn org.apache.cordova.**

# --- WEBVIEW & DEBUGGING ---
-keepclassmembers class fqcn.of.javascript.interface.for.webview { public *; }
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile