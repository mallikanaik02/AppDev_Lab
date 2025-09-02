import 'dart:io';

void main() {
  print("=== Dart I/O & Loops Experiment ===\n");
  
  // INPUT: Get number from user
  print("Enter a positive number:");
  int? num = int.parse(stdin.readLineSync()!);
  
  print("\n--- RESULTS ---");
  
  // FOR LOOP: Print multiplication table
  print("\nMultiplication table for $num:");
  for (int i = 1; i <= 5; i++) {
    print("$num x $i = ${num * i}");
  }
  
  // WHILE LOOP: Count down
  print("\nCountdown from $num:");
  int countdown = num;
  while (countdown > 0) {
    print(countdown);
    countdown--;
  }
  print("Blast off!");
  
  // DO-WHILE LOOP: Sum of digits
  print("\nSum of digits in $num:");
  int temp = num;
  int sum = 0;
  do {
    sum += temp % 10;
    temp ~/= 10;
  } while (temp > 0);
  print("Sum of digits: $sum");
  
  // NESTED LOOP: Pattern printing
  print("\nStar pattern:");
  for (int i = 1; i <= 4; i++) {
    for (int j = 1; j <= i; j++) {
      stdout.write("* ");
    }
    print("");
  }
}
