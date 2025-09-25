import 'dart:async';
import 'dart:html' as html;

class DatabaseHelper {
  static List<Map<String, dynamic>> _calculations = [];
  static int _nextId = 1;
  
  // Save calculation
  Future<void> saveCalculation(String expression, String result) async {
    final calculation = {
      'id': _nextId++,
      'expression': expression,
      'result': result,
      'timestamp': DateTime.now().toString(),
    };
    
    _calculations.add(calculation);
    _saveToLocalStorage();
  }
  
  // Get all calculations  
  Future<List<Map<String, dynamic>>> getAllCalculations() async {
    _loadFromLocalStorage();
    return List.from(_calculations.reversed);
  }
  
  // Delete calculation
  Future<void> deleteCalculation(int id) async {
    _calculations.removeWhere((calc) => calc['id'] == id);
    _saveToLocalStorage();
  }
  
  // Save to browser storage
  void _saveToLocalStorage() {
    final data = _calculations.map((c) => '${c['id']}|${c['expression']}|${c['result']}|${c['timestamp']}').join(';;;');
    html.window.localStorage['calculations'] = data;
  }
  
  // Load from browser storage
  void _loadFromLocalStorage() {
    final data = html.window.localStorage['calculations'];
    if (data != null && data.isNotEmpty) {
      _calculations.clear();
      final items = data.split(';;;');
      for (String item in items) {
        if (item.isNotEmpty) {
          final parts = item.split('|');
          if (parts.length == 4) {
            _calculations.add({
              'id': int.parse(parts[0]),
              'expression': parts[1],
              'result': parts[2],
              'timestamp': parts[3],
            });
          }
        }
      }
    }
  }
}
