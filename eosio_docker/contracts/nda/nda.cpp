#include <eosiolib/eosio.hpp>
#include <iostream>
#include <string>
#include <stdio.h>
#include <time.h>

class addressbook : public eosio::contract {
   public:
      addressbook( account_name s ):
         contract( s ),   // initialization of the base class for the contract
         _records( s, s ) // initialize the table with code and scope NB! Look up definition of code and scope   
      {
      }
      
   private:
      // Setup the struct that represents a row in the table                                                            
      /// @abi table records                   
      
	  const std::string currentDateTime() {
	    time_t     now = time(0);
	    struct tm  tstruct;
	    char       buf[80];
	    tstruct = *localtime(&now);
	    strftime(buf, sizeof(buf), "%Y-%m-%d.%X", &tstruct);

	    return buf;
		}
      
      struct record {
         account_name owner; // primary key                                      
         //uint32_t     phone;
         std::string  employeeName;
         std::string  employeeAddress;
         std::string  company;
         std::string  date; //can get it from currentDateTime() function

         uint64_t primary_key() const { return owner; }
         //uint64_t by_phone() const    { return phone; }
         string employee_name() const { return employeeName}
         string employee_address() const { return employeeName}
         string transactionDate() const { return currentDateTime() }
      };



      typedef eosio::multi_index< N(records), record,
         eosio::indexed_by<N(byphone), eosio::const_mem_fun<record, uint64_t, &record::by_phone> >
      > record_table;

      // Creating the instance of the `record_table` type                      
      record_table _records;
};
	