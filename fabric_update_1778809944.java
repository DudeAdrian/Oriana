```java
package com.example.swarm;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class MainNavigationActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main_navigation);

        BottomNavigationView bottomNavigationView = findViewById(R.id.botto[23D[K
findViewById(R.id.bottomNavigationView);
        bottomNavigationView.setOnNavigationItemSelectedListener(new Bottom[6D[K
BottomNavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item)[5D[K
item) {
                switch (item.getItemId()) {
                    case R.id.feed:
                        loadFragment(new FeedFragment());
                        break;
                    case R.id.chat:
                        loadFragment(new ChatFragment());
                        break;
                    case R.id.wallet:
                        loadFragment(new WalletFragment());
                        break;
                }
                return true;
            }
        });

        loadFragment(new FeedFragment());
    }

    private void loadFragment(Fragment fragment) {
        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTran[25D[K
fragmentManager.beginTransaction();
        fragmentTransaction.replace(R.id.fragment_container, fragment);
        fragmentTransaction.commit();
    }
}
```

