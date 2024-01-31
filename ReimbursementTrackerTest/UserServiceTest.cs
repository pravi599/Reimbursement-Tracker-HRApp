using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ReimbursementTrackerApp.Interfaces;
using ReimbursementTrackerApp.Models.DTOs;
using ReimbursementTrackerApp.Models;
using ReimbursementTrackerApp.Repositories;
using ReimbursementTrackerApp.Services;
using System.Text;
using ReimbursementTrackerApp.Contexts;

namespace ReimbursementTrackerApp.Tests;
    public class UserServiceTest
    {
        IRepository<string, User> repository;
        [SetUp]
        public void Setup()
        {
            var dbOptions = new DbContextOptionsBuilder<RTAppContext>()
                                .UseInMemoryDatabase("dbTestCustomer")//a database that gets created temp for testing purpose
                                .Options;
            RTAppContext context = new RTAppContext(dbOptions);
            repository = new UserRepository(context);

        }

        [Test]
        [TestCase("Test", "test123")]
        //[TestCase("Test", "test321")]
        public void LoginTest(string un, string pass)
        {

            //Arrange
            var appSettings = @"{""SecretKey"": ""Anything will work here this is just for testing""}";
            var configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonStream(new MemoryStream(Encoding.UTF8.GetBytes(appSettings)));
            var tokenService = new TokenService(configurationBuilder.Build());
            IUserService userService = new UserService(repository, tokenService);
            userService.Register(new UserDTO
            {
                Username = un,
                Password = pass,
                Role = "Admin"
            });
            //Action
            var resulut = userService.Login(new UserDTO { Username = "Test", Password = "test123", Role = "Admin" });
            //Assert
            Assert.AreEqual("Test", resulut.Username);
        }
    }