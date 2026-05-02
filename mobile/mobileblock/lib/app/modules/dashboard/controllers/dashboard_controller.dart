import 'package:get/get.dart';

class DashboardController extends GetxController {
  final selectedIndex = 0.obs;

  void changeIndex(int index) => selectedIndex.value = index;

  final stats = [
    {'label': 'Vérifications', 'value': '47', 'trend': 'Ce mois'},
    {'label': 'Authentiques', 'value': '45', 'trend': '95.7%'},
    {'label': 'Faux détectés', 'value': '2', 'trend': 'Alertes'},
    {'label': 'Cette semaine', 'value': '12', 'trend': '+3'},
  ].obs;

  final history = [
    {
      'name': 'OUÉDRAOGO Fatimata',
      'degree': 'Licence Informatique',
      'school': 'Univ. Ouagadougou',
      'date': '24/04/2026',
      'status': 'Authentique',
    },
    {
      'name': 'KADER Moussa',
      'degree': 'Médecine générale',
      'school': 'Univ. Nazi Boni',
      'date': '23/04/2026',
      'status': 'Authentique',
    },
    {
      'name': 'SAWADOGO Aïcha',
      'degree': 'Licence Droit',
      'school': 'Univ. Ouagadougou',
      'date': '22/04/2026',
      'status': 'Authentique',
    },
    {
      'name': 'TRAORÉ Ibrahim',
      'degree': 'BTS Comptabilité',
      'school': 'Institut Privé X',
      'date': '21/04/2026',
      'status': 'Faux diplôme',
    },
  ].obs;
}
