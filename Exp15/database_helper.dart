import 'package:cloud_firestore/cloud_firestore.dart';

class DatabaseHelper {
  final CollectionReference _calculationsCollection =
      FirebaseFirestore.instance.collection('calculations');

  Future<void> saveCalculation(String expression, String result) async {
    await _calculationsCollection.add({
      'expression': expression,
      'result': result,
      'timestamp': FieldValue.serverTimestamp(),
    });
  }

  Future<List<Map<String, dynamic>>> getAllCalculations() async {
    QuerySnapshot snapshot =
        await _calculationsCollection.orderBy('timestamp', descending: true).get();
    return snapshot.docs.map((doc) {
      var data = doc.data() as Map<String, dynamic>;
      return {
        'id': doc.id,
        'expression': data['expression'],
        'result': data['result'],
        'timestamp': data['timestamp']?.toDate().toString() ?? '',
      };
    }).toList();
  }

  Future<void> deleteCalculation(String id) async {
    await _calculationsCollection.doc(id).delete();
  }
}
