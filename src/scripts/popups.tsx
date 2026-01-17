/* Custom popups */

export function showValidationPopup(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, message: string) {
  // Remove any existing popup
  hideValidationPopup(input);
  
  // Create popup element
  const popup = document.createElement('div');
  popup.className = 'custom-validation-popup';
  popup.textContent = message;
  popup.setAttribute('data-validation-popup', 'true');
  
  // Position popup as sibling to input
  popup.style.position = 'absolute';
  popup.style.top = '100%';
  popup.style.left = '0';
  popup.style.marginTop = '8px';

  
  // Ensure parent has relative positioning
  const parent = input.parentElement;
  if (parent) {
    const parentPosition = window.getComputedStyle(parent).position;
    if (parentPosition === 'static') {
      parent.style.position = 'relative';
    }
    parent.appendChild(popup);
  }
  
  // Auto-hide after 10 seconds
  setTimeout(() => hideValidationPopup(input), 10_000);
  
  return popup;
}

export function hideValidationPopup(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) {
  const parent = input.parentElement;
  if (parent) {
    const existingPopup = parent.querySelector('[data-validation-popup="true"]');
    if (existingPopup) {
      existingPopup.remove();
    }
  }
}

export function setupCustomValidation(form: HTMLFormElement) {
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  
  inputs.forEach((input) => {
    const element = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    
    // Prevent default validation popup
    element.addEventListener('invalid', (e) => {
      e.preventDefault();
      
      let message = 'Please fill out this field';
      
      if (element.validity.valueMissing) {
        message = 'Please fill out this field';
      } else if (element.validity.typeMismatch) {
        message = 'Please enter a valid value';
      } else if (element.validity.patternMismatch) {
        message = 'Please match the requested format';
      } else if (element.validity.tooShort) {
        message = `Please lengthen this text to ${element.getAttribute('minlength')} characters or more`;
      } else if (element.validity.tooLong) {
        message = `Please shorten this text to ${element.getAttribute('maxlength')} characters or fewer`;
      }
      
      showValidationPopup(element, message);
    });
    
  });
}
