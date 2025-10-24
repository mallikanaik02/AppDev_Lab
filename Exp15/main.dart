import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'database_helper.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const CalculatorApp());
}

class CalculatorApp extends StatelessWidget {
  const CalculatorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Firebase Calculator',
      theme: ThemeData.dark(),
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
  final DatabaseHelper _dbHelper = DatabaseHelper();

  void onButtonPressed(String text) async {
    setState(() async {
      if (text == "AC") {
        displayText = "0";
        operand1 = "";
        operand2 = "";
        operator = "";
      } else if (text == "C") {
        displayText = "0";
      } else if (text == "+" || text == "-" || text == "×" || text == "/") {
        operand1 = displayText;
        operator = text;
        displayText = "0";
      } else if (text == "=") {
        operand2 = displayText;
        double result = calculate();
        displayText = result.toString();
        String expression = "$operand1 $operator $operand2";
        await _dbHelper.saveCalculation(expression, displayText);
        operand1 = "";
        operand2 = "";
        operator = "";
      } else if (text == ".") {
        if (!displayText.contains(".")) {
          displayText += ".";
        }
      } else if (text == "History") {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => HistoryPage()),
        );
      } else {
        displayText == "0"
            ? displayText = text
            : displayText += text;
      }
    });
  }

  double calculate() {
    double num1 = double.parse(operand1);
    double num2 = double.parse(operand2);
    switch (operator) {
      case "+": return num1 + num2;
      case "-": return num1 - num2;
      case "×": return num1 * num2;
      case "/": return num2 != 0 ? num1 / num2 : 0;
      default: return 0;
    }
  }

  Widget buildButton(String text, {Color color = Colors.grey, Color textColor = Colors.white}) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.all(6),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: color,
            padding: const EdgeInsets.all(22),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          ),
          onPressed: () => onButtonPressed(text),
          child: Text(text, style: TextStyle(fontSize: 22, color: textColor)),
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
        title: const Text('Calculator'),
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
            Expanded(
              child: Container(
                alignment: Alignment.bottomRight,
                padding: const EdgeInsets.all(20),
                child: Text(displayText,
                    style: const TextStyle(fontSize: 48, color: Colors.white)),
              ),
            ),
            Column(
              children: [
                Row(children: [
                  buildButton("AC", color: Colors.grey),
                  buildButton("C", color: Colors.grey),
                  buildButton("", color: Colors.grey),
                  buildButton("/", color: Colors.orange),
                ]),
                Row(children: [
                  buildButton("7"),
                  buildButton("8"),
                  buildButton("9"),
                  buildButton("×", color: Colors.orange),
                ]),
                Row(children: [
                  buildButton("4"),
                  buildButton("5"),
                  buildButton("6"),
                  buildButton("-", color: Colors.orange),
                ]),
                Row(children: [
                  buildButton("1"),
                  buildButton("2"),
                  buildButton("3"),
                  buildButton("+", color: Colors.orange),
                ]),
                Row(children: [
                  buildButton("0"),
                  buildButton("0"),
                  buildButton("."),
                  buildButton("=", color: Colors.orange),
                ]),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class HistoryPage extends StatefulWidget {
  @override
  State<HistoryPage> createState() => _HistoryPageState();
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
    var list = await _dbHelper.getAllCalculations();
    setState(() => _calculations = list);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(title: const Text('History'), backgroundColor: Colors.black),
      body: _calculations.isEmpty
          ? const Center(child: Text('No calculations yet!', style: TextStyle(color: Colors.white)))
          : ListView.builder(
              itemCount: _calculations.length,
              itemBuilder: (context, index) {
                var calc = _calculations[index];
                return Card(
                  color: Colors.grey[850],
                  margin: const EdgeInsets.all(8),
                  child: ListTile(
                    title: Text(
                      '${calc['expression']} = ${calc['result']}',
                      style: const TextStyle(color: Colors.white),
                    ),
                    subtitle: Text(calc['timestamp'].toString(),
                        style: const TextStyle(color: Colors.grey, fontSize: 12)),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red),
                      onPressed: () async {
                        await _dbHelper.deleteCalculation(calc['id']);
                        _loadHistory();
                      },
                    ),
                  ),
                );
              }),
    );
  }
}
