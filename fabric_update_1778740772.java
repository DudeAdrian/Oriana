Here is the modified Java code with the AnimationSet logic merged into the [K
existing SplashActivity.java file:
```java
package com.example.oriana;

import android.app.Activity;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;

public class SplashActivity extends Activity {

    private static final int SPLASH_DURATION = 3000; // 3 seconds

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, Wi[2D[K
WindowManager.LayoutParams.FLAG_FULLSCREEN);

        setContentView(R.layout.activity_splash);

        AnimationSet animation = new AnimationSet(true);

        // Add animations to the set
        AlphaAnimation alphaIn = new AlphaAnimation(0.0f, 1.0f);
        alphaIn.setDuration(SPLASH_DURATION);
        animation.addAnimation(alphaIn);

        TranslateAnimation translateOut = new TranslateAnimation(0.0f, 0.0f[4D[K
0.0f, -1000.0f, 0.0f);
        translateOut.setStartOffset(SPLASH_DURATION);
        translateOut.setFillAfter(true);
        translateOut.setDuration(SPLASH_DURATION);
        animation.addAnimation(translateOut);

        // Set the animation to the view
        AnimationUtils.loadAnimation(this, android.R.anim.fade_in).setDurat[32D[K
android.R.anim.fade_in).setDuration(SPLASH_DURATION);
        findViewById(R.id.splash_view).startAnimation(animation);

        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                Intent intent = new Intent(SplashActivity.this, MainActivit[11D[K
MainActivity.class);
                startActivity(intent);
                finish();
            }
        }, SPLASH_DURATION);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        AnimationSet animation = (AnimationSet) findViewById(R.id.splash_vi[27D[K
findViewById(R.id.splash_view).getAnimation();
        if (animation != null && !animation.hasEnded()) {
            animation.cancel();
        }
    }
}
```
Note that I've assumed the existing SplashActivity.java file had some basic[5D[K
basic setup, and I've only added the necessary code to merge the AnimationS[10D[K
AnimationSet logic. You may need to adjust the imports or add additional co[2D[K
code depending on your specific requirements.

