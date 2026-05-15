```java
package com.example.myapp;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;
import android.view.View;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class MainNavigationActivity extends AppCompatActivity {

    private BottomNavigationView bottomNavigationView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        FragmentManager fragmentManager = getSupportFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTran[25D[K
fragmentManager.beginTransaction();

        FeedFragment feedFragment = new FeedFragment();
        ChatFragment chatFragment = new ChatFragment();
        WalletFragment walletFragment = new WalletFragment();

        fragmentTransaction.add(R.id.fragment_container, feedFragment);
        fragmentTransaction.commit();

        bottomNavigationView = findViewById(R.id.bottom_navigation_view);

        bottomNavigationView.setOnNavigationItemSelectedListener(new Bottom[6D[K
BottomNavigationView.OnNavigationItemSelectedListener() {
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item)[5D[K
item) {

                FragmentManager fragmentManager = getSupportFragmentManager[25D[K
getSupportFragmentManager();
                FragmentTransaction fragmentTransaction = fragmentManager.b[17D[K
fragmentManager.beginTransaction();

                switch (item.getItemId()) {
                    case R.id.menu_feed:
                        fragmentTransaction.replace(R.id.fragment_container[51D[K
fragmentTransaction.replace(R.id.fragment_container, feedFragment);
                        break;
                    case R.id.menu_chat:
                        fragmentTransaction.replace(R.id.fragment_container[51D[K
fragmentTransaction.replace(R.id.fragment_container, chatFragment);
                        break;
                    case R.id.menu_wallet:
                        fragmentTransaction.replace(R.id.fragment_container[51D[K
fragmentTransaction.replace(R.id.fragment_container, walletFragment);
                        break;
                }

                fragmentTransaction.commit();

                return true;
            }
        });
    }
}

```

