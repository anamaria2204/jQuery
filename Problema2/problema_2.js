function validateName(name){
    if (!name || typeof name !== 'string') {
        return false;
    }
    return /^[\p{L}\s'-]+$/u.test(name.trim());
}

function validateAge(age){
    if (age == null || isNaN(age) || !Number.isInteger(age)) {
        return false;
    }
    return age >= 1 && age <= 99;
}

function validateBirthdate(dateString) {
    if (!dateString) return false; // Dacă nu există dată

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false; // Verifică dacă data este invalidă (ex: "abc")

    const today = new Date();
    const minDate = new Date(today.getFullYear() - 99, today.getMonth(), today.getDate());

    return date <= today && date >= minDate;
}

function validateAge2(birthdate, age) {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const diffMonths = today.getMonth() - birthDate.getMonth();
    const diffDays = today.getDate() - birthDate.getDate();

    if (diffMonths < 0 || (diffMonths === 0 && today.getDate() < birthDate.getDate())) {
        if(diffDays < 0){
            calculatedAge--;
        }
    }
    return calculatedAge === age;
}

function validateEmail(email){
    if (!email || typeof email !== 'string') {
        return false;
    }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

$(document).ready(function(){
   $('#submit').on('click', function(event){
       event.preventDefault();

       const name = $('#name').val();
       const birthdate = $('#birthdate').val();
       const age = $('#age').val();
       const email = $('#email').val();

       let errors =[];

       if(!validateName(name)){
           errors.push('Name is invalid');
           $('#name').css('border-color', 'red');
       }
       else{
           $('#name').css('border-color', 'green');
       }

       if(!validateBirthdate(birthdate)) {
           errors.push('Birthdate is invalid');
           $('#birthdate').css('border-color', 'red');
       }
       else{
           $('#birthdate').css('border-color', 'green');
       }

       const ageI = parseInt(age, 10);
       if(!validateAge(ageI)){
           errors.push('Age is invalid');
           $('#age').css('border-color', 'red');
       }
       else{
           $('#age').css('border-color', 'green');
       }

       if(!validateAge2(birthdate, ageI)){
           errors.push('Age does not match birthdate');
           $('#age').css('border-color', 'red');
       }
       else{
           $('#age').css('border-color', 'green');
       }

       if(!validateEmail(email)){
           errors.push('Email is invalid');
           $('#email').css('border-color', 'red');
       }
       else{
           $('#email').css('border-color', 'green');
       }

         if(errors.length > 0){
              alert(errors.join('\n'));
         }
         else{
              alert('Form submitted successfully');
         }

   });
});

