  if (window.navigator.userAgent.toLowerCase().indexOf('safari') !== -1) {

    document.getElementById('addcartios').addEventListener('touchend', () => {

      window.setTimeout(function(){
        const focusElm = document.querySelector('select:focus');
        if (focusElm) { focusElm.closest('div').scrollIntoView({ behavior: 'smooth' }) }
      }, 500);

    });

  }