import React, { useRef, useState, useEffect } from "react";
import loginImage from "../../assets/login.png";
import Logo from "../../assets/logo.svg";

const LoginVerification = () => {
  const inputsRef = useRef([]);
  const [counter, setCounter] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (counter === 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  const handleResend = () => {
    setCounter(60);
    setCanResend(false);
    inputsRef.current.forEach((input) => {
      if (input) input.value = "";
    });
    inputsRef.current = [];
    console.log("Resend code requested");
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      if (index < 5) {
        inputsRef.current[index + 1].focus();
      }
    } else if (value === "") {
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = inputsRef.current.map((input) => input.value).join("");
    console.log("Entered OTP:", otp);
  };

  return (
    <div
      className="w-full min-h-screen flex bg-cover bg-center"
      style={{
        backgroundImage: `
        linear-gradient(
          to right, 
          rgba(37, 99, 235, 0.6),
          rgba(134, 239, 172, 0.3),
          rgba(74, 222, 128, 0)
        ),
        url(${loginImage})
      `,
      }}
    >
      <div className="lg:w-[80%] w-[90%] mx-auto">
        <div className="lg:w-[43%] md:w-[55%]">
          <div className="flex justify-center items-center my-10">
            <img src={Logo} width={300} height={300} />
          </div>

          <div
            className="bg-white bg-opacity-90 rounded-2xl px-8  sm:py-15 py-11 w-full "
            style={{ boxShadow: "inset 0 0px 4px rgba(0, 0, 0, 0.6)" }}
          >
            <div className="text-center sm:mb-10 mb-8">
              <h2 className="text-2xl font-semibold text-center">
                Verify Your Identity
              </h2>
              <p className="text-[#0060A9]  sm:text-sm text-[12px]">
                Enter the verification code sent to your email/phone
              </p>
            </div>

            <form className="sm:space-y-10 space-y-8" onSubmit={handleSubmit}>
              <div className="flex justify-center xl:space-x-5 md:space-x-2  space-x-1 sm:my-10 my-8">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    ref={(el) => (inputsRef.current[i] = el)}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="sm:w-12 sm:h-12 w-9 h-9 text-center rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    style={{
                      boxShadow: "inset 0px 3px 5px rgba(0, 0, 0, 0.15)",
                    }}
                  />
                ))}
              </div>

              <div className="text-center text-xs md:flex justify-center">
                Didn’t receive a code?{" "}
                {!canResend ? (
                  <p className="">
                    <span className="text-[#0060A9]">
                      Resend code after {counter} second
                      {counter !== 1 ? "s" : ""}
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-[#0060A9] underline text-xs"
                  >
                    Resend code
                  </button>
                )}
              </div>

              <button type="submit" className="custom-shadow-button my-3">
                Submit code
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginVerification;
