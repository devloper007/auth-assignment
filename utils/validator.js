
export const validator = (field,value)=> {
        if(field === 'email') {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(value);
        }
        if(field === 'password') {
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return regex.test(value);    
        }
        if(field === 'phone') {
            const regex = /^\d{10}$/;
            return regex.test(value);
        }
}
