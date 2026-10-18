public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name, Industry, Phone FROM Account LIMIT 50];
    }

    @AuraEnabled
    public static void updateAccounts(List<Account> accList) {
        try {
            update accList;
        } catch (DmlException e) {
            throw new AuraHandledException('Error updating accounts: ' + e.getMessage());
        }
    }
}