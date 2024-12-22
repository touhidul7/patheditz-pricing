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
  const [turnaroundDays, setTurnaroundDays] = useState("");
  const [complexity, setComplexity] = useState("");
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
    let basePrice = selectedCategory?.basePrice || 0;

    // Adjust price using timt--------------

    // if (turnaroundDays === "1-3") {
    //   basePrice *= 1.2;
    // } else if (turnaroundDays === "4-7") {
    //   basePrice *= 0.8;
    // } else if (turnaroundDays === "8-30") {
    //   basePrice *= 0.6;
    // }

    // Calculate price using quantity
    const totalPrice = basePrice * quantity;
    setPrice(totalPrice);
    setSubmitted(true);
  };

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
            <div >
              {selectedService && (
                <div className="w-full h-full rounded-lg shadow-lg p-6 border-[1px] border-gray-200">
                  <div className="flex flex-col gap-4 justify-between">
                    <div>
                      <a href="#">
                        <h5 className="text-2xl font-bold tracking-tight text-[#3A3A3A]">
                          {selectedService.name}
                        </h5>
                      </a>
                      <p className="mb-3 font-normal lg:w-[500px] overflow-hidden text-[#3A3A3A]">
                        {selectedService.description}
                      </p>
                    </div>
                    <div className="border-[1px] border-gray-900 w-fit  p-4 rounded-lg">
                      <img
                        className="h-[300px] w-auto lg:w-[300px!important] serviceimage"
                        src={selectedService.imageUrl}
                        alt={selectedService.name}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-end bg-[#F8F6FA] gap-8 shadow-lg rounded-lg p-6 border-[1px] border-gray-200"
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

                {/* Input Date */}
                <div className="mb-8">
                  <RadioInput
                    options={["Simple", "Medium", "Complex"]}
                    radioinput={complexity}
                    setradioinput={setComplexity}
                  />
                </div>
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
        )}
      </section>

      <div className="mt-8 lg:px-52 mb-16">
        {submitted && (
          <PriceTable
            service={service}
            category={category}
            turnaroundTime={`${turnaroundDays} days`}
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
          readOnly
          className="shadow-sm text-center text-lg rounded-lg focus:ring-primary-500 outline-none focus:border-0 block w-full p-2.5 bg-[#F8F6FA] border-none text-[#393939] focus:ring-primary-500 shadow-sm-light"
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
        <table className=" text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 w-full">
          <thead className="text-xs uppercase bg-[#18181B] dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 lg:px-[43px] py-3">
                Service
              </th>
              <th scope="col" className="px-6 lg:px-[43px] py-3">
                Turnaround Time
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
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                className="px-6 lg:px-[43px] py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {service}
              </th>
              <td className="px-6 lg:px-[43px] py-4">{turnaroundTime}</td>
              <td className="px-6 lg:px-[43px] py-4">{category}</td>
              <td className="px-6 lg:px-[43px] py-4">{quantity}</td>
              <td className="px-6 lg:px-[43px] py-4">${price}</td>
              <td className="px-6 lg:px-[43px] py-4">
                <button className="px-4 bg-[#594FEE] py-1 rounded-lg text-white">
                  Proceed
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RadioInput({ options, radioinput, setradioinput }) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setradioinput(event.target.value);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="grid  grid-cols-3 gap-4">
        {options.map((option) => (
          <label
            key={option}
            className={`shadow-sm text-lg text-center rounded-lg block py-2 px-4 lg:px-10 cursor-pointer bg-[#F8F6FA] border-none text-[#A2A6AD] focus:ring-primary-500 shadow-sm-light outline-none ${
              selectedOption === option
                ? "bg-[#377DFF] text-[#fff]"
                : "bg-[#18181B] text-[#000] hover:bg-[#E5EEF7]"
            }`}
          >
            <input
              type="radio"
              value={option}
              checked={selectedOption === option && radioinput === option}
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
