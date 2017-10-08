import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import {
  Step,
  Stepper,
  StepLabel,
  StepContent
} from 'material-ui/Stepper'
import FlatButton from 'material-ui/FlatButton'

class Home extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      finished: false,
      stepIndex: 0
    }
    this.handleNext = this.handleNext.bind(this)
    this.handlePrev = this.handlePrev.bind(this)
    this.renderStepActions = this.renderStepActions.bind(this)
  }

  componentWillMount () {
  }

  handleNext () {
    const {stepIndex} = this.state
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2
    })
  }

  handlePrev () {
    const {stepIndex} = this.state
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1})
    }
  }

  renderStepActions (step) {
    const {stepIndex} = this.state

    return (
      <div style={{margin: '12px 0'}}>
        <RaisedButton
          label={stepIndex === 2 ? 'terminar' : 'próximo'}
          disableTouchRipple
          disableFocusRipple
          primary
          onClick={this.handleNext}
          style={{marginRight: 12}}
        />
        {step > 0 && (
          <FlatButton
            label='atrás'
            disabled={stepIndex === 0}
            disableTouchRipple
            disableFocusRipple
            onClick={this.handlePrev}
          />
        )}
      </div>
    )
  }

  render () {
    const {finished, stepIndex} = this.state

    return (
      <div>
        <div style={{paddingTop: 20}}>
          <p>La intención de las Palomas Mensajeras es contribuir a que se establezca comunicación básica entre grupos incomunicados.  Por esta razón se le da mayor importancia a lograr ese contacto que a la privacidad del mensaje.  Es posible que la conversación sea vista por terceros.</p>
        </div>
        <div style={{maxWidth: 380, maxHeight: 400, margin: 'auto'}}>
          <Stepper activeStep={stepIndex} orientation='vertical'>
            <Step>
              <StepLabel>Visita el url que recibiste</StepLabel>
              <StepContent>
                <p>
                  Si alguien que está incomunicado te envió un mensaje recibiste un sms que contiene un link.
                </p>
                {this.renderStepActions(0)}
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Lee el mensaje</StepLabel>
              <StepContent>
                <p>Una vez vayas a la dirección que se te envió vas a ver el nombre de la persona y el mensaje que te envió.  Si hubo un error por favor contesta también e indicale a la persona, es muy posible que la misma esté tratando de lograr comunicación con sus familiares.</p>
                {this.renderStepActions(1)}
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Contesta el mensaje</StepLabel>
              <StepContent>
                <p>Cuando alguien regrese al área en donde está la persona llevara su mensaje</p>
                {this.renderStepActions(2)}
              </StepContent>
            </Step>
          </Stepper>
          {finished && (
            <p style={{margin: '20px 0', textAlign: 'center'}}>
              <a
                href='#'
                onClick={(event) => {
                  event.preventDefault()
                  this.setState({stepIndex: 0, finished: false})
                }}
              >
                Haga clic aquí
              </a> para ver los pasos otra vez.
            </p>
          )}
        </div>
      </div>
    )
  }
}

export default Home
