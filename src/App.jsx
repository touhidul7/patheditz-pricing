/* eslint-disable react/prop-types */
import { CircleMinus, CirclePlus } from "lucide-react";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const [services, setServices] = useState([]);
  const [service, setService] = useState("");
  const [category, setCategory] = useState("");
  const [turnaroundDays, setTurnaroundDays] = useState("24h");
  const [complexity, setComplexity] = useState("Simple");

  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/data/pricing.json")
      .then((response) => {
        setServices(response.data);
        setLoading(false);
        if (response.data.length > 0) {
          setService(response.data[0].name);
        }
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the testimonials data!",
          error
        );
        setLoading(false);
      });
  }, []);

  const selectedService = services.find((s) => s.name === service);
  const selectedCategory = selectedService?.categories.find(
    (c) => c.name === category
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    let basePrice = selectedCategory?.basePrice || selectedService?.categories[0]?.basePrice;
    let logicnum = selectedCategory?.logic || selectedService?.categories[0]?.logic

  
    // Step 1: Complexity-Based Logic
    let complexityBasedPrice = basePrice;
    if (complexity === "Medium") {
      complexityBasedPrice += basePrice * (logicnum/2);
    } else if (complexity === "Complex") {
      complexityBasedPrice += basePrice * logicnum;
    }
  
    // Step 2: Time-Based Logic
    let timeBasedPrice = complexityBasedPrice;
    if (turnaroundDays === "24h") {
      timeBasedPrice += complexityBasedPrice * (logicnum/2);
    } else if (turnaroundDays === "12h") {
      timeBasedPrice += complexityBasedPrice * logicnum;
    }
  
    // Step 3: Quantity-Based Logic
    const totalPrice = timeBasedPrice * quantity;
  
    setPrice(totalPrice.toFixed(2));
    // setPrice(totalPrice);
    setSubmitted(true);
  };
  
  

  console.log(selectedService?.categories[0].name);

  /*  */
  return (
    <>
      <section className="py-8 lg:py-0 lg:my-16 px-4 lg:px-0 mx-auto max-w-screen lg:mt-48 mt-20">
        <div className="text-center pb-8 lg:mb-16 mb-10">
          <h6 className="text-center text-white contact-heading lg:text-[60px]  text-[20px] font-normal lg:leading-[80px]">
            <div className="text-[#3A3A3A] font-bold bg-clip-text">
              Our Pricing
            </div>
          </h6>
          <p className="lg:text-[20px] font-normal lg:leading-[50px] text-[#3A3A3A] lg:px-44 text-center">
            Select your requirements and see our service pricing to get started
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 grid-cols-1 w-full lg:px-48 px-4">
            <div>
              {selectedService && (
                <div className="w-full h-full rounded-lg  p-6  border-gray-200">
                  <div className="flex flex-col gap-4 justify-between">
                    <div>
                      <a href="#">
                        <h5 className="text-2xl font-bold tracking-tight text-[#3A3A3A]">
                          {selectedCategory?.name ||
                            selectedService?.categories[0].name}
                        </h5>
                      </a>
                      <p className="mb-3 font-normal lg:w-[500px] overflow-hidden text-[#3A3A3A]">
                        Per image{" "}
                        {selectedCategory?.name ||
                          selectedService?.categories[0].name}{" "}
                        starting at just.... $
                        {selectedCategory?.basePrice ||
                          selectedService?.categories[0].basePrice}
                      </p>
                    </div>
                    {/* Image */}
                    <div className=" w-fit  p-4 rounded-lg">
                      <img
                        className="h-[300px] w-auto lg:w-full serviceimage"
                        src={
                          selectedCategory?.imageUrl ||
                          selectedService?.categories[0].imageUrl
                        }
                        alt={selectedService.name}
                      />
                    </div>
                    <p className="mb-3 font-normal lg:w-[500px] overflow-hidden text-[#3A3A3A]">
                      <h2 className="text-lg font-semibold">
                        {selectedCategory?.content1 ||
                          selectedService?.categories[0].content1}
                      </h2>
                      {selectedCategory?.content2 ||
                        selectedService?.categories[0].content2}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col  bg-[#F8F6FA] gap-8 shadow-lg rounded-lg p-6 border-[1px] border-gray-200"
              >
                <div className="input-fields gp-8 flex flex-col justify-between">
                  {/* Service Selection */}
                  <InputSelect
                    disabledvalue={true}
                    value={service}
                    placeholder="Select Service"
                    onChange={(e) => {
                      setService(e.target.value);
                      setCategory("");
                    }}
                    services={services.map((s) => s.name)}
                  />

                  {/* Service category selection */}
                  {selectedService && selectedService.categories && (
                    <div className="my-8">
                      <InputSelect
                        disabledvalue={false}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        services={selectedService.categories.map((c) => c.name)}
                      />
                    </div>
                  )}

                  {/* Complexity  */}
                  <div className="mb-8">
                    <RadioInput
                      options={["Simple", "Medium", "Complex"]}
                      radioinput={complexity}
                      setradioinput={setComplexity}
                    />
                  </div>
                  {/* Time */}
                  <div className="mb-8">
                    <RadioInput
                      options={["12h", "24h", "48h"]}
                      radioinput={turnaroundDays}
                      setradioinput={setTurnaroundDays}
                    />
                  </div>
                  {/* Select Quantity of website */}
                  <QuantitySelector
                    quantity={quantity}
                    setQuantity={setQuantity}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#377DFF] hover:bg-[#0072DD] text-white p-3 rounded-lg"
                >
                  Calculate
                </button>
              </form>
            </div>
          </div>
        )}
      </section>

      <div className="mt-8 lg:px-52 mb-16">
        {submitted && (
          <PriceTable
            service={service}
            category={category || selectedService?.categories[0].name}
            turnaroundTime={turnaroundDays}
            quantity={quantity}
            price={price}
          />
        )}
      </div>
    </>
  );
}

export default App;

function InputSelect({
  value,
  onChange,
  services,
  placeholder,
  disabledvalue,
}) {
  return (
    <div>
      <div className="w-full border-[1px] border-blue-100 rounded-lg">
        <select
          required
          name=""
          id="service"
          className="shadow-sm text-lg rounded-lg focus:ring-primary-500 outline-none focus:border-0 block w-full p-2.5
           bg-[#F8F6FA] border-none text-[#444444] focus:ring-primary-500 shadow-sm-light"
          value={value}
          onChange={onChange}
        >
          {" "}
          {placeholder && (
            <option value="" disabled={disabledvalue}>
              {placeholder}
            </option>
          )}
          {services.map((service, index) => (
            <option key={index} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function QuantitySelector({ quantity, setQuantity }) {
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else if (event.target.value === "") {
      setQuantity(""); // Allow empty input for user flexibility
    }
  };

  const handleInputBlur = () => {
    // Reset to 1 if the field is left empty
    if (quantity === "" || quantity < 1) {
      setQuantity(1);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-4">
        {/* Decrease button */}
        <div
          onClick={handleDecrease}
          className={`shadow-sm text-lg rounded-lg block py-2 px-10 cursor-pointer bg-[#F8F6FA] border-none text-[#393939] focus:ring-primary-500 shadow-sm-light ${
            quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-disabled={quantity <= 1}
        >
          <CircleMinus />
        </div>

        {/* Quantity display/input */}
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="shadow-sm text-center text-lg rounded-lg focus:ring-primary-500 outline-none focus:border-0 block w-full p-2.5 bg-[#F8F6FA] border-none text-[#393939] focus:ring-primary-500 shadow-sm-light"
          min="1"
        />

        {/* Increase button */}
        <div
          onClick={handleIncrease}
          className="shadow-sm text-lg rounded-lg block py-2 px-10 cursor-pointer bg-[#F8F6FA] border-none text-[#393939] focus:ring-primary-500 shadow-sm-light"
        >
          <CirclePlus />
        </div>
      </div>
    </div>
  );
}

function PriceTable({ service, turnaroundTime, quantity, price, category }) {
  return (
    <div>
      <div className="relative overflow-x-auto w-full">
        <table className=" text-sm text-left rtl:text-right text-black w-full">
          <thead className="text-xs uppercase bg-gray-200 ">
            <tr>
              <th scope="col" className="px-6 lg:px-[43px] py-3">
                Service
              </th>
              <th scope="col" className="px-6 lg:px-[43px] py-3">
                Deadline
              </th>
              <th scope="col" className="px-6 lg:px-[43px] py-3">
                Service Type
              </th>
              <th scope="col" className="px-6 lg:px-[43px] py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 lg:px-[43px] py-3">
                Price
              </th>
              <th scope="col" className="px-6 lg:px-[43px] py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b ">
              <th
                scope="row"
                className="px-6 lg:px-[43px] py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {service}
              </th>
              <td className="px-6 lg:px-[43px] py-4">{turnaroundTime}</td>
              <td className="px-6 lg:px-[43px] py-4">{category}</td>
              <td className="px-6 lg:px-[43px] py-4">{quantity}</td>
              <td className="px-6 lg:px-[43px] py-4">${price}</td>
              <td className="px-6 lg:px-[43px] py-4">
                <a href={"https://patheditz.com/contact/"} target="_blank">
                  <button className="px-4 bg-[#594FEE] py-1 rounded-lg text-white">
                    Proceed
                  </button>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RadioInput({ options, radioinput, setradioinput }) {
  const handleOptionChange = (event) => {
    setradioinput(event.target.value);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-4">
        {options.map((option) => (
          <label
            key={option}
            className={`shadow-md text-lg text-center rounded-lg block py-2 px-4 lg:px-10 cursor-pointer border-none focus:ring-primary-500 shadow-sm-light outline-none ${
              radioinput === option
                ? "bg-[#377DFF] text-[#fff]"
                : "bg-[#F8F6FA] text-[#000] hover:bg-[#377dffea] hover:text-white"
            }`}
          >
            <input
              type="radio"
              value={option}
              checked={radioinput === option}
              onChange={handleOptionChange}
              className="hidden"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="w-full flex justify-center items-center">
      <div
        aria-label="Loading..."
        role="status"
        className="flex items-center space-x-2"
      >
        <svg
          className="h-20 w-20 animate-spin stroke-gray-500"
          viewBox="0 0 256 256"
        >
          <line
            x1="128"
            y1="32"
            x2="128"
            y2="64"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="24"
          ></line>
          <line
            x1="195.9"
            y1="60.1"
            x2="173.3"
            y2="82.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="24"
          ></line>
          <line
            x1="224"
            y1="128"
            x2="192"
            y2="128"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="24"
          ></line>
          <line
            x1="195.9"
            y1="195.9"
            x2="173.3"
            y2="173.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="24"
          ></line>
          <line
            x1="128"
            y1="224"
            x2="128"
            y2="192"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="24"
          ></line>
          <line
            x1="60.1"
            y1="195.9"
            x2="82.7"
            y2="173.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="24"
          ></line>
          <line
            x1="32"
            y1="128"
            x2="64"
            y2="128"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="24"
          ></line>
          <line
            x1="60.1"
            y1="60.1"
            x2="82.7"
            y2="82.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="24"
          ></line>
        </svg>
        <span className="text-4xl font-medium text-gray-500">Loading...</span>
      </div>
    </div>
  );
}
