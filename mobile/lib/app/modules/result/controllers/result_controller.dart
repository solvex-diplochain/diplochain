import 'package:get/get.dart';

class ResultController extends GetxController {
  final diplomaData = Rxn<Map<String, dynamic>>();
  final isSuccess = true.obs;

  @override
  void onInit() {
    super.onInit();
    if (Get.arguments != null) {
      diplomaData.value = Map<String, dynamic>.from(Get.arguments);
      isSuccess.value = true;
    } else {
      isSuccess.value = false;
    }
  }

  void backToSearch() => Get.back();
}
