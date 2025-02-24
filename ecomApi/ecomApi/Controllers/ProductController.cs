using ecomApi.DataModels;
using ecomApi.DBContext;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ecomApi.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all products
       // [Authorize(Roles = "User")]
        [HttpGet]
        public IActionResult GetAllProducts()
        {
            var products = _context.Products.ToList();
            return Ok(products);
        }

        // Get product by ID
       // [Authorize(Roles = "User")]
        [HttpGet("{id}")]
        public IActionResult GetProduct(int id)
        {
            var product = _context.Products.SingleOrDefault(p => p.Id == id);

            if (product == null)
                return NotFound();

            return Ok(product);
        }

     //   [Authorize(Roles = "Admin")]

        [HttpPost]
        public IActionResult CreateProduct([FromBody] Product product)
        {
            if (product == null)
            {
                return BadRequest("Product cannot be null.");
            }

            _context.Products.Add(product);  // Add the product to the context
            _context.SaveChanges();  // Save the changes to the database

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);  // Return the created product with a 201 status code
        }
    }
}
