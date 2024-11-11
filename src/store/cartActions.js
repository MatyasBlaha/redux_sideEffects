import { uiActions } from "./ui-slice";
import { cartActions } from "./cart-slice";

export function fetchData(){
    return async dispatch => {
        const fetchData = async () => {
            const response = await fetch('https://redux-sideeffects-b6c0f-default-rtdb.europe-west1.firebasedatabase.app/cart.json')
            const data = await response.json();

            if(!response.ok){
                throw new Error('Failed to fetch data');
            }

            return data;
        };

        try {
            const cartData = await fetchData();
            dispatch(cartActions.replaceCart({
                items: cartData.items || [],
                totalQuantity: cartData.totalQuantity
            }));
        } catch (error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error!...',
                message: 'Fetching cart data failed!...'
            }))
        }
    };
}


export function sendCartData(cart){
    return async(dispatch) => {
        dispatch(uiActions.showNotification({
                status: 'pending',
                title: 'Sending...',
                message: 'Sending cart data...'
            })
        );

        async function sendRequest(){
            const response = await fetch('https://redux-sideeffects-b6c0f-default-rtdb.europe-west1.firebasedatabase.app/cart.json', {
                method: 'PUT',
                body: JSON.stringify({
                    items: cart.items,
                    totalQuantity: cart.totalQuantity
                })
            });

            if(!response.ok){
                throw new Error('Failed to send cart data');
            }
        }

        try {
            await sendRequest();

            dispatch(uiActions.showNotification({
                status: 'success',
                title: 'Success!...',
                message: 'Sent cart data successfully!...'
            }))
        } catch (error) {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error!...',
                message: 'Sending cart data failed!...'
            }))
        }
    }
}