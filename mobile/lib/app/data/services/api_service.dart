import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../../core/values/app_config.dart';

class ApiService extends GetConnect {
  static ApiService get to => Get.find();
  final _storage = GetStorage();

  @override
  void onInit() {
    httpClient.baseUrl = AppConfig.baseUrl;
    
    // Intercepteur pour ajouter le token JWT à chaque requête
    httpClient.addRequestModifier<dynamic>((request) {
      final token = _storage.read(AppConfig.tokenKey);
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }
      return request;
    });

    super.onInit();
  }

  // --- Authentification ---
  
  Future<Response> login(String email, String password) {
    return post('/auth/login', {
      'email': email,
      'password': password,
    });
  }

  Future<Response> register(Map<String, dynamic> data) {
    return post('/auth/register', data);
  }

  Future<Response> getProfile() {
    return get('/auth/me');
  }

  // --- Diplômes ---

  Future<Response> verifyDiploma(String code) {
    return get('/diplomes/verify/$code');
  }

  Future<Response> getAllDiplomas() {
    return get('/diplomes');
  }

  Future<Response> createDiploma(Map<String, dynamic> data) {
    return post('/diplomes', data);
  }

  // --- Statistiques ---

  Future<Response> getDashboardStats() {
    return get('/stats');
  }

  // --- Institutions ---

  Future<Response> getInstitutions() {
    return get('/institutions');
  }

  // --- Étudiants ---

  Future<Response> getStudents() {
    return get('/students');
  }

  // --- Session Management ---

  void saveUser(Map<String, dynamic> userData) {
    _storage.write(AppConfig.userKey, userData);
  }

  Map<String, dynamic>? getUser() {
    return _storage.read(AppConfig.userKey);
  }

  void saveToken(String token) {
    _storage.write(AppConfig.tokenKey, token);
  }

  void logout() {
    _storage.remove(AppConfig.tokenKey);
    _storage.remove(AppConfig.userKey);
  }
}
