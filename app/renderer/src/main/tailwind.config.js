module.exports = {
    purge: [],
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {
            minWidth: {
                '20':'5rem',
                '250-px':'250px'
            },
            maxWidth:{
                '500-px':'500px'
            },
            backgroundImage: theme => ({
                'esLogoColor': "url('/assets/pic/logo-elastic-search-24-color.png')",
            })
        },
        textColor: theme => ({
            ...theme('colors'),
            'indexTitleTextColor': '#d8d8d8',
            'secondary': '#ffed4a',
            'danger': '#e3342f',
        }),
        backgroundColor: theme => ({
            ...theme('colors'),
            'headBlackBg': '#343535',
            'headLightBg': '#f3f3f3',
            'asideBg': '#2c2f30',
            'asideLightBg': '#e8e8e8',
            'elMainBlackBg': '#1d1f20',
            'elMainLightBg': '#f7f7ff',
            'rightMenuColor': '#27292b',
            'rightMenuColorLight': '#e1e2e3',
            'connectionInfoMainColor': '#1e1e1e',
            'connectionInfoExternalColor': '#222221',
            'connectionInfoInputColor': '#292929',
            'connectionInfoBackGroundColorLight': '#ececec'
        }),
    },
    variants: {
        extend: {
            backgroundColor: ['active'],
            borderStyle:['dark']
        }
    },
    plugins: [],
}
