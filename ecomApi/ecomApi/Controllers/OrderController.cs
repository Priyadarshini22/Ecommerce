using ecomApi.DataModels;
using ecomApi.DBContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace ecomApi.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all orders for the current user
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            // Get the user's ID from the toke (this is provided after the user logs in)
            var a = User.Claims;

            var orders = await _context.Orders.Include(o => o.Items)  // Include the related OrderItems
                                       .ToListAsync();

            return Ok(orders);
        }

        // Get order by ID (for the current user)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var userId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "nameid")?.Value);

            var order = await _context.Orders
                                      .Include(o => o.Items)  // Include the related OrderItems
                                      .SingleOrDefaultAsync(o => o.Id == id && o.UserName == "user");

            if (order == null)
                return NotFound();

            return Ok(order);
        }

        // POST: api/orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order orderRequest)
        {
            if (orderRequest == null)
            {
                return BadRequest("Order request is invalid. Please provide order items.");
            }

            // Get the user's ID from the JWT token

            // Create the new order object
            //var order = new Order
            //{
            //    Id = orderRequest.Id,
            //    UserName = orderRequest.UserName,
            //    OrderDate = DateTime.Now,
            //    Items = orderRequest.Items.Select(item => new OrderItem
            //    {
            //        ProductId = item.ProductId,
            //        Quantity = item.Quantity,
            //        Price = item.Price
            //    }).ToList()
            //};

            try
            {
                // Save the order to the database
                await _context.Orders.AddAsync(orderRequest);
                await _context.SaveChangesAsync();  // Save asynchronously
            }
            catch (Exception ex)
            {
                // Log the exception (you can replace this with a logger)
                return StatusCode(500, "An error occurred while saving the order.");
            }

            return CreatedAtAction(nameof(GetOrder), new { id = orderRequest.Id }, orderRequest);  // Return the created order with a 201 status code
        }
    }
}
