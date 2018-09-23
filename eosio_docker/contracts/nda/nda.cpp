#include <eosiolib/eosio.hpp>
#include <iostream>
#include <string>
#include <stdio.h>
#include <time.h>

class nda : public eosio::contract {
   
      
   private:
                        
      struct record {
         account_name owner; // primary key
         uint32_t     prim_key;
         account_name employeeName;
         // can't use std::string employeeName because we can't search for it otherwise;
         std::string  employeeAddress;
         std::string  companyAddress;
         account_name company;
         std::string  content;
         std::string  contractName;
         uint64_t     dateCreate;
         uint64_t     dateSigned;
         bool         contractSigned; 

         auto primary_key() const { return prim_key; }
         account_name get_by_company() const    { return company; }
      };

      typedef eosio::multi_index< N(records), record,
         eosio::indexed_by<N(bycompany), eosio::const_mem_fun<record, account_name, &record::get_by_company> >
      > record_table;

      public:
      using contract::contract;
      /// @abi action
      void create(account_name _employee, account_name _company, std::string& _employeeAddress, std::string& _companyAddress, std::string& _content, std::string& _contractName){
         record_table obj(_self, _self);
         obj.emplace( _self, [&]( auto& rec ){
            rec.prim_key = obj.available_primary_key();
            rec.employeeName = _employee;
            rec.employeeAddress = _employeeAddress;
            rec.company = _company;
            rec.companyAddress = _companyAddress;
            rec.content = _content;
            rec.contractName = _contractName;
            rec.dateCreate = now();
            rec.contractSigned = false;
         });
      };

      void sign( account_name _user, uint64_t contract_prim_key ) {
      // to sign the action with the given account
        require_auth( _user );
        record_table obj(_self, _self); // code, scope
        const auto& contractObj = obj.get(contract_prim_key);
        // get create the dateSigned field.
        // update object
        obj.modify( contractObj, _self, [&]( auto& rec ) {
          rec.contractSigned = true;
          rec.dateSigned = now();
        });
      };
};

EOSIO_ABI( nda, (create)(sign) )