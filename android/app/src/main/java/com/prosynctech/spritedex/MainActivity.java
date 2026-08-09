package com.prosynctech.spritedex;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.google.firebase.FirebaseApp;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        try {
            FirebaseApp.initializeApp(this);
        } catch (Exception e) {
            // Safely catch if Firebase is already initialized
        }
    }
}