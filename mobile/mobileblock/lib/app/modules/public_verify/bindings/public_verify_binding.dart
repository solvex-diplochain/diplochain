import 'package:get/get.dart';
import '../controllers/public_verify_controller.dart';

class PublicVerifyBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut<PublicVerifyController>(
      () => PublicVerifyController(),
    );
  }
}
