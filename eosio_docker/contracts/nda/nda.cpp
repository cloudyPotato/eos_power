#include <eosiolib/eosio.hpp>
#include <iostream>
#include <string>
#include <stdio.h>
#include <time.h>

class nda : public eosio::contract {
   
      
   private:
                        
      
	  /*const std::string currentDateTime() {
	    time_t     now = time(0);
	    struct tm  tstruct;
	    char       buf[80];
	    tstruct = *localtime(&now);
	    strftime(buf, sizeof(buf), "%Y-%m-%d.%X", &tstruct);

	    return buf;
		}*/
      // Setup the struct that represents a row in the table                                                            
      /// @abi table records 
      struct record {
         account_name owner; // primary key                                      
         uint32_t     prim_key;
         account_name employeeName;
         std::string  employeeAddress;
         std::string  companyAddress;
         account_name company;
         std::string  content;
         uint64_t     timestamp; 

         auto primary_key() const { return prim_key; }
         account_name get_by_company() const    { return company; }
      };



      typedef eosio::multi_index< N(records), record,
         eosio::indexed_by<N(bycompany), eosio::const_mem_fun<record, account_name, &record::get_by_company> >
      > record_table;

      public:
      using contract::contract;
      /// @abi action
      void sign(account_name _employee, account_name _company, std::string& _employeeAddress, std::string& _companyAddress, std::string& _content){
         record_table obj(_self, _self);
         obj.emplace( _self, [&]( auto& rec ){
            rec.prim_key = obj.available_primary_key();
            rec.employeeName = _employee;
            rec.employeeAddress = _employeeAddress;
            rec.company = _company;
            rec.companyAddress = _companyAddress;
            rec.content = _content;
            rec.timestamp = now();
         });
      }
};

EOSIO_ABI( nda, (sign) )
	