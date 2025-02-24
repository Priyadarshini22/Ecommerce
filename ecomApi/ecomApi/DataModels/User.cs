using Microsoft.AspNetCore.Identity;

namespace ecomApi.DataModels
{
    public class User : IdentityUser
    {
        public int Id { get; set; }
        public string Email { get; set; }
    }
}
