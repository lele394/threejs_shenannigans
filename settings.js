const chunk_settings = {

    chunk_size : 8,
    loading_radius: 1,
    auto_update: false,

};


const render_settings = {

    wireframe: false,
    wireframe_color: 0xffffff,

    material_color: 0x00ff00,
    grid_color: 0xff0000,

};



const keyboard_settings =  {
    AZERTY : {
        up : "r",
        down : "f",
        right : "d",
        left : "q",
        front : "z",
        back : "s",
        r_right :"e",
        r_left : "a"
    },

    QWERTY : {
        up : "r",
        down : "f",
        right : "d",
        left : "a",
        front : "w",
        back : "s",
        r_right :"e",
        r_left : "q"
    }
}



export {chunk_settings, render_settings, keyboard_settings};