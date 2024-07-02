// vim: set sw=2 ts=2 et :
let socket = null;
let ws_url = null;
let pin_fuer_alle = false;
let wrong_pin = false;

const start_websocket = (pin) => {
  const name_input = document.getElementById('name_zuschauer');
  const name = name_input.value;
  if (name_input.checkValidity() === false) {
    return false;
  }
  if (socket == null) {
    socket = new WebSocket(ws_url);
    // Connection opened
    socket.addEventListener('open', function (event) {
        console.log("Nachricht gesendet");
        socket.send(JSON.stringify({
          name: name,
          beitrag: parseInt(name_input.dataset['beitrag'], 10),
          pin: pin,
        }));
        console.log("Nachricht fertig gesendet");
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
      const data = JSON.parse(event.data);
      console.log('Message from server ', data);
      if (data.join_url) {
        window.location = data.join_url;
        wrong_pin = false;
      } else if (data.error == 'pin_mismatch') {
        $('#pin').popover('show');
        wrong_pin = true;
      }
    });
    socket.addEventListener('error', abort_join);
    socket.addEventListener('close', abort_join);
    return true;
  }
  return false;
};

const join_attendee = (event) => {
  event.preventDefault();
  let pin = null;
  if (pin_fuer_alle) {
    pin = document.getElementById('pin').value;
  }
  if (start_websocket(pin)) {
    $('#join_dialog').modal('show');
  }
};

const open_pin_dlg = (event) => {
  event.preventDefault();
  const name_input = document.getElementById('name_zuschauer');
  if (name_input.checkValidity() === true) {
    $('#pin_dialog').modal('show');
  }
};
const join_mod = (event) => {
  event.preventDefault();
  event.stopPropagation();
  const pin = document.getElementById('pin').value;
  if (start_websocket(pin)) {
    //$('#pin_dialog').modal('hide');
  }
  return false;
};

const abort_join = (event) => {
  console.log(event);
  console.log("socket closed");
  // wenn die PIN richtig ist oder wir einen Workshop haben (pin für alle),
  // muss der Dialog geschlossen werden. Bei Vorträgen ist die PIN im Dialog,
  // d.h. der Dialog bleibt offen
  if (!wrong_pin || pin_fuer_alle) {
    $('#join_dialog').modal('hide');
    $('#pin_dialog').modal('hide');
  }
  if (socket) {
    socket.close()
    socket = null;
  }
};

const validate_name = () => {
  const name_input = document.getElementById('name_zuschauer');
  const btn_zuschauer = document.getElementById('btn_zuschauer');
  if (!pin_fuer_alle) {
    const btn_moderator = document.getElementById('btn_moderator');
  }
  if (name_input.checkValidity() === true) {
    btn_zuschauer.removeAttribute('disabled');
    if (!pin_fuer_alle) {
      btn_moderator.removeAttribute('disabled');
    }
  } else {
    btn_zuschauer.setAttribute('disabled', '');
    if (!pin_fuer_alle) {
      btn_moderator.setAttribute('disabled', '');
    }
  }
  validate_pin();
  window.localStorage.setItem('name', name_input.value);
};

const validate_pin = () => {
  const name_input = document.getElementById('name_zuschauer');
  const pin_input = document.getElementById('pin');
  if (!pin_fuer_alle) {
    const btn_startconf = document.getElementById('btn_startconf');
    if (name_input.checkValidity() === true && pin_input.checkValidity() === true) {
      btn_startconf.removeAttribute('disabled');
    } else {
      btn_startconf.setAttribute('disabled', '');
    }
  }
  $('#pin').popover('hide');
}


document.addEventListener('DOMContentLoaded', (event) => {
  // Websocket Pfad initialisieren
  if (window.location.protocol == 'https:') {
    ws_url = `wss://cox.hrz.tu-chemnitz.de/ws`;
  } else {
    ws_url = `ws://cox.hrz.tu-chemnitz.de/ws`;
  }
  const btn_zuschauer = document.getElementById('btn_zuschauer');
  if (!btn_zuschauer) {
    return;
  }
  btn_zuschauer.addEventListener('click', join_attendee);
  document.getElementById('btn_abort').addEventListener('click', abort_join);
  let btn_startconf = document.getElementById('btn_startconf');
  if (btn_startconf) {
    btn_startconf.addEventListener('click', join_mod);
    $('#pin_dialog').on('hidden.bs.modal', abort_join);
    document.getElementById('btn_moderator').addEventListener('click', open_pin_dlg);
  } else {
    pin_fuer_alle = true;
  }
  $('#join_dialog').on('hidden.bs.modal', abort_join);
  console.log('DOM fully loaded and parsed');
  document.getElementById('name_zuschauer').addEventListener('input', validate_name);
  document.getElementById('pin').addEventListener('input', validate_pin);
  $('#pin').popover({content: 'PIN mismatch', placement: 'bottom', trigger: 'manual'});
  if ('name' in window.localStorage) {
    document.getElementById('name_zuschauer').value = window.localStorage.getItem('name');
  }
  validate_name();
});
