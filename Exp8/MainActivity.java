package com.example.counterapp;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private TextView counterText;
    private Button incrementButton, decrementButton, resetButton;
    private int counter = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Connect to UI elements
        counterText = findViewById(R.id.counterText);
        incrementButton = findViewById(R.id.incrementButton);
        decrementButton = findViewById(R.id.decrementButton);
        resetButton = findViewById(R.id.resetButton);

        // Set click listeners
        incrementButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                counter++;
                updateCounter();
                Toast.makeText(MainActivity.this, "Incremented to " + counter, Toast.LENGTH_SHORT).show();
            }
        });

        decrementButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                counter--;
                updateCounter();
                Toast.makeText(MainActivity.this, "Decremented to " + counter, Toast.LENGTH_SHORT).show();
            }
        });

        resetButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                counter = 0;
                updateCounter();
                Toast.makeText(MainActivity.this, "Counter Reset!", Toast.LENGTH_SHORT).show();
            }
        });

        // Initial display
        updateCounter();
    }

    private void updateCounter() {
        counterText.setText(String.valueOf(counter));

        // Change color based on counter value
        if (counter > 0) {
            counterText.setTextColor(Color.GREEN);
        } else if (counter < 0) {
            counterText.setTextColor(Color.RED);
        } else {
            counterText.setTextColor(Color.BLUE);
        }
    }

    // Save counter when app goes to background
    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putInt("counter_value", counter);
    }

    // Restore counter when app comes back
    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);
        counter = savedInstanceState.getInt("counter_value");
        updateCounter();
    }
}
