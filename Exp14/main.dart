import 'package:flutter/material.dart';
import 'database_helper.dart';

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
  
  // Add database helper
  final DatabaseHelper _dbHelper = DatabaseHelper();
  
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
        
        // Save to database - THIS IS THE NEW PART!
        String expression = "$operand1 $operator $operand2";
        _dbHelper.saveCalculation(expression, displayText);
        
        operand1 = "";
        operand2 = "";
        operator = "";
      }
      else if (buttonText == ".") {
        // Handle decimal
        if (!displayText.contains(".")) {
          displayText = displayText == "0" ? "0." : "$displayText.";
        }
      }
      else if (buttonText == "History") {
        // Navigate to history page
        Navigator.push(
          context, 
          MaterialPageRoute(builder: (context) => HistoryPage())
        );
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
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: const Text('Calculator', style: TextStyle(color: Colors.white)),
        actions: [
          IconButton(
            icon: const Icon(Icons.history, color: Colors.white),
            onPressed: () => onButtonPressed("History"),
          ),
        ],
      ),
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

// History Page
class HistoryPage extends StatefulWidget {
  @override
  _HistoryPageState createState() => _HistoryPageState();
}

class _HistoryPageState extends State<HistoryPage> {
  final DatabaseHelper _dbHelper = DatabaseHelper();
  List<Map<String, dynamic>> _calculations = [];

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  void _loadHistory() async {
    List<Map<String, dynamic>> calculations = await _dbHelper.getAllCalculations();
    setState(() {
      _calculations = calculations;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        title: const Text('History', style: TextStyle(color: Colors.white)),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: _calculations.isEmpty
          ? const Center(
              child: Text(
                'No calculations yet!',
                style: TextStyle(color: Colors.white, fontSize: 18),
              ),
            )
          : ListView.builder(
              itemCount: _calculations.length,
              itemBuilder: (context, index) {
                final calc = _calculations[index];
                return Card(
                  color: Colors.grey[800],
                  margin: const EdgeInsets.all(8),
                  child: ListTile(
                    title: Text(
                      '${calc['expression']} = ${calc['result']}',
                      style: const TextStyle(color: Colors.white, fontSize: 18),
                    ),
                    subtitle: Text(
                      calc['timestamp'].toString().split('.')[0],
                      style: const TextStyle(color: Colors.grey, fontSize: 12),
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red),
                      onPressed: () async {
                        await _dbHelper.deleteCalculation(calc['id']);
                        _loadHistory();
                      },
                    ),
                  ),
                );
              },
            ),
    );
  }
}
