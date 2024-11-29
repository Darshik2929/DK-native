package com.dkproduct

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.util.Log
import androidx.annotation.RequiresApi
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)  // Correct syntax
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            try {
                val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

                // Foreground Channel with notification_sound.mp3
                val foregroundChannelId = "sound_channel"
                val foregroundChannelName = "Important Notifications"
                val foregroundImportance = NotificationManager.IMPORTANCE_HIGH
                val foregroundChannel = NotificationChannel(foregroundChannelId, foregroundChannelName, foregroundImportance)
                
                val soundUriForeground = Uri.parse("android.resource://${packageName}/raw/notification_sound")
                val audioAttributes = AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .build()
                foregroundChannel.setSound(soundUriForeground, audioAttributes)

                // Background Channel with notification_sound_background.mp3
                val backgroundChannelId = "background_sound_channel"
                val backgroundChannelName = "Background Notifications"
                val backgroundImportance = NotificationManager.IMPORTANCE_HIGH
                val backgroundChannel = NotificationChannel(backgroundChannelId, backgroundChannelName, backgroundImportance)
                
                val soundUriBackground = Uri.parse("android.resource://${packageName}/raw/notification_sound_background")
                backgroundChannel.setSound(soundUriBackground, audioAttributes)

                // Register the channels with the notification manager
                notificationManager.createNotificationChannel(foregroundChannel)
                notificationManager.createNotificationChannel(backgroundChannel)

            } catch (e: Exception) {
                Log.e("MainActivity", "Error creating notification channels", e)
            }
        }
    }

    override fun getMainComponentName(): String = "dkproduct"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
