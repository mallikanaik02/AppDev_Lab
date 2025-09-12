import 'package:flutter/material.dart';

void main() {
  runApp(const CalculatorApp());
}

class CalculatorApp extends StatelessWidget {
  const CalculatorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Calculator',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const CalculatorUI(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class CalculatorUI extends StatefulWidget {
  const CalculatorUI({super.key});

  @override
  State<CalculatorUI> createState() => _CalculatorUIState();
}

class _CalculatorUIState extends State<CalculatorUI> {
  String displayText = "0";
  String operand1 = "";
  String operand2 = "";
  String operator = "";
  
  // Button press handler
  void onButtonPressed(String buttonText) {
    setState(() {
      if (buttonText == "AC") {
        // Clear everything
        displayText = "0";
        operand1 = "";
        operand2 = "";
        operator = "";
      }
      else if (buttonText == "C") {
        // Clear current entry
        displayText = "0";
      }
      else if (buttonText == "+" || buttonText == "-" || buttonText == "×" || buttonText == "/") {
        // Handle operators
        operand1 = displayText;
        operator = buttonText;
        displayText = "0";
      }
      else if (buttonText == "=") {
        // Calculate result
        operand2 = displayText;
        double result = calculate();
        displayText = result.toString();
        operand1 = "";
        operand2 = "";
        operator = "";
      }
      else if (buttonText == ".") {
        // Handle decimal
        if (!displayText.contains(".")) {
          displayText = displayText == "0" ? "0." : displayText + ".";
        }
      }
      else {
        // Handle numbers
        if (displayText == "0") {
          displayText = buttonText;
        } else {
          displayText = displayText + buttonText;
        }
      }
    });
  }

  // Calculate function
  double calculate() {
    double num1 = double.parse(operand1);
    double num2 = double.parse(operand2);
    
    switch (operator) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "×":
        return num1 * num2;
      case "/":
        return num2 != 0 ? num1 / num2 : 0;
      default:
        return 0;
    }
  }

  Widget buildButton(String text, {Color color = Colors.grey, Color textColor = Colors.white}) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.all(6.0),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: color,
            padding: const EdgeInsets.all(22),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          onPressed: () => onButtonPressed(text),
          child: Text(
            text,
            style: TextStyle(fontSize: 22, color: textColor),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          children: [
            // Display area
            Expanded(
              child: Container(
                alignment: Alignment.bottomRight,
                padding: const EdgeInsets.all(20),
                child: Text(
                  displayText,
                  style: const TextStyle(fontSize: 48, color: Colors.white),
                ),
              ),
            ),
            // Buttons
            Column(
              children: [
                Row(
                  children: [
                    buildButton("AC", color: Colors.grey),
                    buildButton("C", color: Colors.grey),
                    buildButton("", color: Colors.grey), // Empty button
                    buildButton("/", color: Colors.orange),
                  ],
                ),
                Row(
                  children: [
                    buildButton("7"),
                    buildButton("8"),
                    buildButton("9"),
                    buildButton("×", color: Colors.orange),
                  ],
                ),
                Row(
                  children: [
                    buildButton("4"),
                    buildButton("5"),
                    buildButton("6"),
                    buildButton("-", color: Colors.orange),
                  ],
                ),
                Row(
                  children: [
                    buildButton("1"),
                    buildButton("2"),
                    buildButton("3"),
                    buildButton("+", color: Colors.orange),
                  ],
                ),
                Row(
                  children: [
                    buildButton("0"),
                    buildButton("0"), // Second 0 button
                    buildButton("."),
                    buildButton("=", color: Colors.orange),
                  ],
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
