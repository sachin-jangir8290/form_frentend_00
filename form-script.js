let currentStep = 1;

function showLoadingSpinner() {
  // Remove any existing spinner
  const existingSpinner = document.querySelector(".loading-overlay");
  if (existingSpinner) {
    existingSpinner.remove();
  }

  // Create loading overlay
  const overlay = document.createElement("div");
  overlay.className = "loading-overlay";

  // Create spinner HTML
  overlay.innerHTML = `
    <div class="pl">
      <svg class="pl__rings" viewBox="0 0 128 128" width="128px" height="128px">
        <g fill="none" stroke-linecap="round" stroke-width="4">
          <g class="pl__ring">
            <circle class="pl__ring" r="56" cx="64" cy="64" transform="rotate(-90,64,64)"></circle>
          </g>
          <g class="pl__ring">
            <circle class="pl__ring" r="52" cx="64" cy="64" transform="rotate(-90,64,64)"></circle>
          </g>
          <g class="pl__ring">
            <circle class="pl__ring" r="48" cx="64" cy="64" transform="rotate(-90,64,64)"></circle>
          </g>
          <g class="pl__ring">
            <circle class="pl__ring" r="44" cx="64" cy="64" transform="rotate(-90,64,64)"></circle>
          </g>
        </g>
        <g fill="none" class="pl__worm">
          <path class="pl__worm" d="M92,15.492S78.194,4.967,66.743,16.887c-17.231,17.938,21.267,27.165,20.755,40.049-.76,19.438-33.841,22.079-42.234,9.772C27.72,34.562,85.19,22.688,92,15.492Z"></path>
        </g>
      </svg>
    </div>
  `;

  document.body.appendChild(overlay);
}

function hideLoadingSpinner() {
  const spinner = document.querySelector(".loading-overlay");
  if (spinner) {
    spinner.remove();
  }
}

function goToStep(stepNumber) {
  // Validate current step before proceeding
  if (stepNumber > currentStep) {
    if (!validateCurrentStep()) {
      return;
    }
  }

  // Hide all steps
  document.querySelectorAll(".form-step").forEach((step) => {
    step.style.display = "none";
  });

  // Show the requested step
  document.getElementById(`step${stepNumber}`).style.display = "block";

  // Update current step
  currentStep = stepNumber;

  // Update progress bar
  updateProgressBar();

  // Update step indicator
  document.getElementById("currentStep").textContent = currentStep;
}

function validateCurrentStep() {
  const stepElement = document.getElementById(`step${currentStep}`);
  const requiredFields = stepElement.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );
  let firstEmptyField = null;
  let validationMessages = [];

  // Clear previous error styling and messages
  stepElement.querySelectorAll(".error-field").forEach((field) => {
    field.classList.remove("error-field");
  });
  stepElement.querySelectorAll(".field-error-message").forEach((msg) => {
    msg.remove();
  });

  // Validate required fields
  for (let field of requiredFields) {
    if (!field.value.trim()) {
      if (!firstEmptyField) {
        firstEmptyField = field;
      }
      field.classList.add("error-field");
      addErrorMessage(field, "This field is required");
    } else {
      field.classList.remove("error-field");
    }
  }

  // Special validation for email
  const emailField = stepElement.querySelector('input[type="email"]');
  if (emailField) {
    if (
      emailField.value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)
    ) {
      emailField.classList.add("error-field");
      addErrorMessage(emailField, "Please enter a valid email address");
      if (!firstEmptyField) {
        firstEmptyField = emailField;
      }
    } else if (!emailField.value && emailField.hasAttribute("required")) {
      emailField.classList.add("error-field");
      addErrorMessage(emailField, "Email is required");
      if (!firstEmptyField) {
        firstEmptyField = emailField;
      }
    }
  }

  // Special validation for phone
  const phoneField = stepElement.querySelector("#phone");
  if (phoneField) {
    const digitsOnly = phoneField.value.replace(/\D/g, "");
    if (phoneField.value && digitsOnly.length !== 10) {
      phoneField.classList.add("error-field");
      addErrorMessage(phoneField, "Please enter a valid 10-digit phone number");
      if (!firstEmptyField) {
        firstEmptyField = phoneField;
      }
    } else if (!phoneField.value && phoneField.hasAttribute("required")) {
      phoneField.classList.add("error-field");
      addErrorMessage(phoneField, "Phone number is required");
      if (!firstEmptyField) {
        firstEmptyField = phoneField;
      }
    }
  }

  // Special validation for captcha
  const captchaField = stepElement.querySelector('input[name="captcha"]');
  if (captchaField) {
    const expectedCaptcha =
      document.getElementById("captchaDisplay").textContent;
    if (
      captchaField.value &&
      captchaField.value.toUpperCase() !== expectedCaptcha
    ) {
      captchaField.classList.add("error-field");
      addErrorMessage(captchaField, "Captcha code is incorrect");
      if (!firstEmptyField) {
        firstEmptyField = captchaField;
      }
    } else if (!captchaField.value && captchaField.hasAttribute("required")) {
      captchaField.classList.add("error-field");
      addErrorMessage(captchaField, "Captcha is required");
      if (!firstEmptyField) {
        firstEmptyField = captchaField;
      }
    }
  }

  // Validate terms checkbox
  const termsField = stepElement.querySelector('input[name="terms"]');
  if (
    termsField &&
    termsField.hasAttribute("required") &&
    !termsField.checked
  ) {
    termsField.classList.add("error-field");
    addErrorMessage(termsField, "You must agree to the terms and conditions");
    if (!firstEmptyField) {
      firstEmptyField = termsField;
    }
  }

  if (firstEmptyField) {
    firstEmptyField.focus();
    return false;
  }

  return true;
}

function addErrorMessage(field, message) {
  // Remove existing error message for this field
  const existingMessage = field.parentNode.querySelector(
    ".field-error-message"
  );
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new error message
  const errorDiv = document.createElement("div");
  errorDiv.className = "field-error-message";
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    color: #ff0000;
    font-size: 12px;
    margin-top: 4px;
    font-weight: 500;
  `;

  // Insert after the field
  field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function updateProgressBar() {
  const progressBar = document.getElementById("progressFill");
  if (currentStep === 1) {
    progressBar.style.width = "1%";
  } else if (currentStep === 2) {
    progressBar.style.width = "50%";
  } else if (currentStep === 3) {
    progressBar.style.width = "90%";
  }
}

// Captcha functionality
function generateCaptcha() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  document.getElementById("captchaDisplay").textContent = result;
  return result;
}

// Initialize the form
document.addEventListener("DOMContentLoaded", () => {
  updateProgressBar();

  // Generate initial captcha
  generateCaptcha();

  // Phone number formatting
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let x = e.target.value.replace(/\D/g, ""); // remove non-digits
      if (x.length > 0) x = "(" + x;
      if (x.length > 4) x = x.slice(0, 4) + ") " + x.slice(4);
      if (x.length > 9) x = x.slice(0, 9) + "-" + x.slice(9);
      e.target.value = x.slice(0, 14);
    });
  }

  // Make budget profile checkboxes mutually exclusive (radio button behavior)
  const budgetProfileCheckboxes = document.querySelectorAll(
    'input[name="budgetProfile"]'
  );
  budgetProfileCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        budgetProfileCheckboxes.forEach((cb) => {
          if (cb !== this) cb.checked = false;
        });
      }
    });
  });

  // Make hasSetBudget checkboxes mutually exclusive (radio button behavior)
  const hasSetBudgetCheckboxes = document.querySelectorAll(
    'input[name="hasSetBudget"]'
  );
  hasSetBudgetCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        hasSetBudgetCheckboxes.forEach((cb) => {
          if (cb !== this) cb.checked = false;
        });
      }
    });
  });

  // Handle form submission
  document
    .getElementById("confidentialityForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      // Final validation before submission
      if (!validateCurrentStep()) {
        showMessage("Please correct the errors and try again.", "error");
        return;
      }

      // Show loading overlay immediately
      showLoadingSpinner();

      const formData = new FormData(e.target);

      // Debug: Log form data being sent
      console.log("Form data being sent:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      try {
        const response = await fetch(
          "https://form-code-backend.vercel.app/submit-form",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          // Hide loading and show success message
          hideLoadingSpinner();
          showMessage(
            "Form submitted successfully! We will contact you soon.",
            "success"
          );
          // Reset form
          e.target.reset();
          // Reset to first step
          goToStep(1);
          // Regenerate captcha
          generateCaptcha();
        } else {
          // Hide loading and show error message
          hideLoadingSpinner();
          const errorData = await response.json().catch(() => ({}));
          showMessage(
            errorData.error || "Error submitting form. Please try again.",
            "error"
          );
        }
      } catch (error) {
        console.error("Error:", error);
        // Hide loading and show error message
        hideLoadingSpinner();
        showMessage(
          "Error submitting form. Please check your connection and try again.",
          "error"
        );
      }
    });

  function showLoadingSpinner() {
    // Remove any existing spinner
    const existingSpinner = document.querySelector(".loading-overlay");
    if (existingSpinner) {
      existingSpinner.remove();
    }

    // Create loading overlay
    const overlay = document.createElement("div");
    overlay.className = "loading-overlay";

    // Create spinner HTML
    overlay.innerHTML = `
      <div class="pl">
        <svg class="pl__rings" viewBox="0 0 128 128" width="128px" height="128px">
          <g fill="none" stroke-linecap="round" stroke-width="4">
            <g class="pl__ring">
              <circle class="pl__ring" r="56" cx="64" cy="64" transform="rotate(-90,64,64)"></circle>
            </g>
            <g class="pl__ring">
              <circle class="pl__ring" r="52" cx="64" cy="64" transform="rotate(-90,64,64)"></circle>
            </g>
            <g class="pl__ring">
              <circle class="pl__ring" r="48" cx="64" cy="64" transform="rotate(-90,64,64)"></circle>
            </g>
            <g class="pl__ring">
              <circle class="pl__ring" r="44" cx="64" cy="64" transform="rotate(-90,64,64)"></circle>
            </g>
          </g>
          <g fill="none" class="pl__worm">
            <path class="pl__worm" d="M92,15.492S78.194,4.967,66.743,16.887c-17.231,17.938,21.267,27.165,20.755,40.049-.76,19.438-33.841,22.079-42.234,9.772C27.72,34.562,85.19,22.688,92,15.492Z"></path>
          </g>
        </svg>
      </div>
    `;

    document.body.appendChild(overlay);
  }

  function hideLoadingSpinner() {
    const spinner = document.querySelector(".loading-overlay");
    if (spinner) {
      spinner.remove();
    }
  }

  function showMessage(message, type) {
    // Remove any existing message
    const existingMessage = document.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement("div");
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;

    // Style the message
    messageDiv.style.cssText = `
      padding: 12px 16px;
      margin-bottom: 20px;
      border-radius: 4px;
      font-weight: 500;
      text-align: center;
      ${
        type === "success"
          ? "background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;"
          : "background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;"
      }
    `;

    // Insert message at the top of the form
    const form = document.getElementById("confidentialityForm");
    form.insertBefore(messageDiv, form.firstChild);

    // Auto-hide success messages after 5 seconds
    if (type === "success") {
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.remove();
        }
      }, 5000);
    }
  }
});
