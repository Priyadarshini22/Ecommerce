using ecomApi.DataModels;
using ecomApi.DBContext;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ecomApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AuthController(ApplicationDbContext context, IConfiguration configuration, UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _context = context;
            _configuration = configuration;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest model)
        {
            //if (_context.Users.Any(u => u.Username == model.Username))
            //{
            //    return BadRequest("Username is already taken.");
            //}

            //var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

            //var newUser = new User
            //{
            //    Username = model.Username,
            //    PasswordHash = hashedPassword,  // Store hashed password
            //    Email = model.Email
            //};

            //_context.Users.Add(newUser);
            //_context.SaveChanges();

            //return Ok("User registered successfully!");
            var existingUser = await _userManager.FindByNameAsync(model.UserName);
            if (existingUser != null)
            {
                return BadRequest("Username already exists.");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);


            var user = new User
            {
                UserName = model.UserName,
                Email = model.Email,
                PasswordHash = hashedPassword,  

            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            if (model.Role == "Admin" || model.Role == "User")
            {
                await _userManager.AddToRoleAsync(user, model.Role);
                if (model.Role == "Admin" && !(model.DateOfBirth == null))  
                {
                    return BadRequest("Date of Birth is required for Admin role.");
                }
            }
            else
            {
                return BadRequest("Invalid role. Please choose either Admin or User.");
            }

            return Ok(new { Message = "User registered successfully!" });
        }


        //[HttpPost("login")]
        //public async Task<IActionResult>  Login([FromBody] LoginRequest model)
        //{
        //    //var user = _context.Users.SingleOrDefault(u => u.Username == model.Username);

        //    //if (user == null || !VerifyPassword(model.Password, user.PasswordHash))
        //    //{
        //    //    return Unauthorized();
        //    //}

        //    //var token = GenerateJwtToken(user);

        //    //return Ok(new { token });

        //    var user = await _userManager.FindByNameAsync(model.Username);

        //    var res = await _userManager.CheckPasswordAsync(user, model.Password);
        //    if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        //    {
        //        var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();
        //        var token = GenerateJwtToken(user, role);

        //        return Ok(new { token,user,role });
        //    }

        //    return Unauthorized();
        //}

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            // Find the user by username
            var user = await _userManager.FindByNameAsync(model.UserName);

            // If user doesn't exist or the password is incorrect
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized("Invalid username or password");
            }

            // Get the user's role
            var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();

            // Generate JWT token
            var token = GenerateJwtToken(user, role);

            // Return the token, user info, and role
            return Ok(new { token, user.UserName, role });
        }


        private bool VerifyPassword(string inputPassword, string storedPasswordHash)
        {
            // Implement password hashing and comparison logic here
            return BCrypt.Net.BCrypt.Verify(inputPassword, storedPasswordHash);
        }

        private string GenerateJwtToken(User user, string role)
        {
            var claims = new List<Claim>
            {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, role) // Single role added here

        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
