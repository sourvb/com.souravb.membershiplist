(function(angular, $, _) {

  angular.module('membershiplist').config(function($routeProvider) {
      $routeProvider.when('/memberships', {
        controller: 'MembershiplistMembershipsCtrl',
        templateUrl: '~/membershiplist/MembershipsCtrl.html',

        resolve: {
          members: function(crmApi) {
            var membership = crmApi('Membership', 'get', {
              "sequential": 1,
              "debug": 1,
              "active_only": 1,
              "api.Contact.getsingle": {"return":"display_name"}
            });
            return membership;
          }
        }
      });
    }
  );

  // The controller uses *injection*. This default injects a few things:
  //   $scope -- This is the set of variables shared between JS and HTML.
  //   crmApi, crmStatus, crmUiHelp -- These are services provided by civicrm-core.
  //   members -- The current members, defined above in config().
  angular.module('membershiplist').controller('MembershiplistMembershipsCtrl', function($scope, crmApi, crmStatus, crmUiHelp, members) {
    // The ts() and hs() functions help load strings for this module.
    var ts = $scope.ts = CRM.ts('membershiplist');
    var hs = $scope.hs = crmUiHelp({file: 'CRM/membershiplist/MembershipsCtrl'}); // See: templates/CRM/membershiplist/MembershipsCtrl.hlp
    var start_date_range = {};

    // We have members available in JS. We also want to reference it in HTML.
    $scope.members = members;

    $scope.search = function search() {

      /* Condition for setting date range based on input */
      if(members.start_date_from != "" && members.start_date_to != "") {
        start_date_range = {"BETWEEN":[]};
        start_date_range["BETWEEN"].push(members.start_date_from, members.start_date_to);
      } else if(members.start_date_from == "" && members.start_date_to != "") {
        start_date_range = {"<=": members.start_date_to};
      } else if(members.start_date_from != "" && members.start_date_to == "") {
        start_date_range = {">=": members.start_date_from};
      }

      var membership = crmApi('Membership', 'get', {
          "sequential": 1,
          "debug": 1,
          "start_date": start_date_range,
          "active_only": 1,
          "api.Contact.getsingle": {"return":"display_name"}
        });
      membership.then(function(data) {
        $scope.members.values = data.values;
      });
    };
  });

})(angular, CRM.$, CRM._);
