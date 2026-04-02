export const UI_CONTENT = {
  HEADER: {
    TITLE: 'Order your favourite food here',
    DESCRIPTION: 'Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.',
    BUTTON_TEXT: 'View Menu',
  },
  FOOTER: {
    DESCRIPTION: "Thank you for choosing Coconut for your culinary cravings! We're dedicated to bringing you a delightful dining experience with every order. Whether it's a quick bite or a sumptuous feast, we're here to satisfy your hunger. Stay connected with us for the latest updates, promotions, and more mouthwatering menus. Bon appétit!",
    COMPANY_TITLE: 'COMPANY',
    GET_IN_TOUCH_TITLE: 'GET IN TOUCH',
    QUICK_LINKS: ['Home', 'About us', 'Delivery', 'Privacy policy'],
    CONTACT: {
      PHONE: '+91 1234567890',
      EMAIL: 'contact@coconut.com',
    },
    COPYRIGHT: (year: number) => `Copyright ${year} © coconut.com - All Right Reserved.`,
  },
  CART: {
    TITLE: 'Your Cart',
    EMPTY_MESSAGE: 'Your cart is completely empty.',
    PROMO_CODE_PROMPT: 'If you have a promo code, enter it here',
    CHECKOUT_BUTTON: 'PROCEED TO CHECKOUT',
  },
  PLACE_ORDER: {
    TITLE: 'Delivery Information',
    PHONE_PLACEHOLDER: 'Phone Number',
    ZIP_PLACEHOLDER: 'Zip Code',
    TOTAL_HEADER: 'Cart Totals',
    PAYMENT_BUTTON: 'PROCEED TO PAYMENT'
  },
  EXPLORE_MENU: {
    TITLE: 'Explore our menu',
    DESCRIPTION: 'Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your cravings and elevate your dining experience.',
  },
  APP_DOWNLOAD: {
    TEXT: 'For Better Experience Download Coconut App',
  },
  FOOD_DISPLAY: {
    TITLE: 'Exclusive Delights',
  },
  NAVBAR: {
    HOME: 'Home',
    MENU: 'Menu',
    MOBILE_APP: 'Mobile App',
    CONTACT_US: 'Contact Us',
    SIGN_IN: 'Sign In',
    PROFILE: 'Profile',
    ORDERS: 'Orders',
    LOGOUT: 'Logout',
  },
  LOGIN: {
    SIGN_UP_TITLE: 'Sign Up',
    LOGIN_TITLE: 'Login',
    NAME_PLACEHOLDER: 'Your name',
    EMAIL_PLACEHOLDER: 'Your email',
    PASSWORD_PLACEHOLDER: 'Password',
    CREATE_ACCOUNT_BTN: 'Create account',
    LOGIN_BTN: 'Login',
    TERMS_AGREEMENT: 'By continuing, I agree to the terms of use & privacy policy.',
    CREATE_NEW_PROMPT: 'Create a new account?',
    ALREADY_HAVE_PROMPT: 'Already have an account?',
    CLICK_HERE: 'Click here',
    LOGIN_HERE: 'Login here',
  },
  MY_ORDERS: {
    TITLE: 'My Orders',
    NO_ORDERS: 'No orders found',
    TRACK_ORDER_BTN: 'Track Order',
    ITEMS_PREFIX: 'Items: ',
  },
  PROFILE: {
    TITLE: 'Edit Profile',
    NAME_LABEL: 'Name',
    NAME_PLACEHOLDER: 'Your Name',
    EMAIL_LABEL: 'Email (Cannot be changed)',
    EMAIL_PLACEHOLDER: 'Your Email',
    PASSWORD_LABEL: 'New Password (Optional)',
    PASSWORD_PLACEHOLDER: 'Leave blank to keep current',
    UPDATE_BUTTON: 'Update Profile',
  }
};
