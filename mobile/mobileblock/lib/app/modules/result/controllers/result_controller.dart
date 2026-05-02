import 'package:get/get.dart';

class ResultController extends GetxController {
  final isSuccess = true.obs;

  void toggleResult() => isSuccess.value = !isSuccess.value;
}
