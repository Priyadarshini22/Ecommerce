namespace ecomApi.DataModels
{
    public class Payment
    {

        public long Amount { get; set; } // The amount paid (in the smallest currency unit, e.g., cents)
        public string Description { get; set; }
        public string Name { get; set; }
        public AddressDetail Address { get; set; }

    }

    public class AddressDetail
    {
        public string Line1 {get; set;} 
        public string Line2 {get; set;} 
        public string City {get; set;}  
        public string State { get; set; }  
        public string PostalCode { get; set; }  
        public string Country { get; set; }
    }
}
