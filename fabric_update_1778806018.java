```java
package swarm;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class SplashActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        Button btn = findViewById(R.id.btn);

        btn.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent myIntent = new Intent(v.getContext(), LoginActivity.[14D[K
LoginActivity.class);
                startActivity(myIntent);
                finish();
            }
        });

        // Set the motto
        TextView mottoTextView = findViewById(R.id.motto_text_view);
        mottoTextView.setText("Golden New Day");

        // Fade in animation
        Animation fadeInAnimation = AnimationUtils.loadAnimation(this, R.an[4D[K
R.anim.fade_in_animation);
        motoTextView.startAnimation(fadeInAnimation);
    }
}
```

