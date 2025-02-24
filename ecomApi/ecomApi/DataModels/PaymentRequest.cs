namespace ecomApi.DataModels
{
    public class PaymentRequest
    {
            public int Id { get; set; }
           
            public int UserId { get; set; }
            public long Amount { get; set; }  
            public string Status { get; set; } 
            public string StripePaymentId { get; set; } 
            public DateTime CreatedAt { get; set; } 

    }
}
