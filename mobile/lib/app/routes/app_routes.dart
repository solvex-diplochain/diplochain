part of 'app_pages.dart';

abstract class Routes {
  Routes._();
  static const LANDING = _Paths.LANDING;
  static const LOGIN = _Paths.LOGIN;
  static const DASHBOARD = _Paths.DASHBOARD;
  static const RESULT = _Paths.RESULT;
  static const PUBLIC_VERIFY = _Paths.PUBLIC_VERIFY;
  static const REGISTER = _Paths.REGISTER;
}

abstract class _Paths {
  _Paths._();
  static const LANDING = '/landing';
  static const LOGIN = '/login';
  static const DASHBOARD = '/dashboard';
  static const RESULT = '/result';
  static const PUBLIC_VERIFY = '/public-verify';
  static const REGISTER = '/register';
}
