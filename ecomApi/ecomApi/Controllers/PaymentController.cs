using ecomApi.DataModels;
using ecomApi.DBContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

namespace ecomApi.Controllers
{
    [Route("api/payment")]
    [ApiController]
    public class PaymentController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PaymentController(ApplicationDbContext context)
        {
            _context = context;
        }

        ///*        publi*/c ActionResult CreateCheckoutSession()
        //{
        //var domain = "https://localhost:5001";
        //var options = new SessionCreateOptions()
        //{
        //    LineItems = new List<SessionLineItemOptions>()
        //    {
        //        new SessionLineItemOptions()
        //        {
        //            Price = "price_1Qs2yCSCJTlo1sdtuqDkTu6U",
        //            Quantity = 1
        //        }
        //    },
        //    PaymentMethodTypes = new List<string>()
        //    {
        //        "card"
        //    },
        //    Mode = "payment",
        //    SuccessUrl = domain + "/success",
        //    CancelUrl = domain + "/cancel"
        //};

        //var service = new SessionService();
        //Session session = service.Create(options);

        //    var options = new PaymentIntentCreateOptions
        //    {
        //        Amount = 2000, // amount in cents
        //        Currency = "usd",
        //        PaymentMethodTypes = new List<string> { "card" },
        //        Description = "One-time payment for product",
        //        Metadata = new Dictionary<string, string>
        //    {
        //        { "order_id", "order_123" }
        //    }
        //    };

        //    var service = new PaymentIntentService();
        //    PaymentIntent paymentIntent = service.Create(options);

        //    //Response.Headers.Add("Location", session.Url);
        //    return new StatusCodeResult(303);
        //}

        //[Authorize(Roles = "User")]
        [HttpPost]
        public IActionResult CreatePaymentIntent(Payment payment)
        {
            try
            {
                var currency = "usd"; // Currency for the transaction

                // Create a PaymentIntent
                var options = new PaymentIntentCreateOptions
                {
                    Amount = payment.Amount,
                    Currency = currency,
                    PaymentMethodTypes = new List<string> { "card" },
                    Description = payment.Description,
                    Shipping = new ChargeShippingOptions
            {
                Name = payment.Name, 
                Address = new AddressOptions
                {
                    Line1 = payment.Address.Line1,  
                    Line2 = payment.Address.Line2,      
                    City = payment.Address.City,   
                    State = payment.Address.State,           
                    PostalCode = payment.Address.PostalCode, 
                    Country = payment.Address.Country        
                }
            }
                };

                var service = new PaymentIntentService();
                var paymentIntent = service.Create(options);

                return Ok(new { clientSecret = paymentIntent.ClientSecret });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

    }
}
