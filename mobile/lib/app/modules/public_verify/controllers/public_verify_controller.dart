import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../data/services/api_service.dart';
import '../../../routes/app_pages.dart';
import '../views/qr_scanner_view.dart';

class PublicVerifyController extends GetxController {
  final apiService = ApiService.to;
  
  final codeController = TextEditingController();
  final isLoading = false.obs;

  Future<void> startScan() async {
    final result = await Get.to(() => const QrScannerView());
    if (result != null && result is String) {
      // Si le résultat est une URL, extraire le code à la fin
      final code = _extractCodeFromUrl(result);
      codeController.text = code;
      verifyDiploma();
    }
  }

  String _extractCodeFromUrl(String result) {
    if (result.contains('/verify/')) {
      try {
        return result.split('/verify/').last;
      } catch (e) {
        return result;
      }
    }
    return result;
  }

  Future<void> verifyDiploma() async {
    final code = codeController.text.trim();
    
    if (code.isEmpty) {
      Get.snackbar(
        'Erreur',
        'Veuillez entrer un numéro de diplôme',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
      return;
    }

    try {
      isLoading.value = true;
      final response = await apiService.verifyDiploma(code);

      if (response.status.isOk) {
        // Rediriger vers la page de résultat avec les données du diplôme
        Get.toNamed(Routes.RESULT, arguments: response.body['data']);
      } else {
        Get.snackbar(
          'Vérification échouée',
          response.body['message'] ?? 'Diplôme non trouvé ou invalide',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.orange,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      Get.snackbar(
        'Erreur',
        'Impossible de contacter le serveur',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  @override
  void onClose() {
    codeController.dispose();
    super.onClose();
  }
}
