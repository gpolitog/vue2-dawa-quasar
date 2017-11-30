<template>
  <div class="">
    <slot name="label-top"></slot>
          <q-input :placeholder="placeholder"
                   :id="fieldId"
                   :name="fieldName"
                   v-model="inputText"
          @input="handleInputChange($event)"
          @keydown="getCaretChange()"
          @focus="focused = true; handleInputChange(inputText)">
              <!--:static-data="{field: 'value', list: results}"-->

              <q-autocomplete
                      separator
                      @search="search"
                      :min-characters="2"
                      @selected="selectedItem"
              />
          </q-input>
          <code>
            <pre>
                {{results}}
            </pre>
          </code>
  </div>
</template>
<script>
  function setCaretPosition (elemId, caretPos) {
    let elem = document.getElementsByName(elemId)[0]

    if (elem !== null) {
      if (elem.createTextRange) {
        var range = elem.createTextRange()
        range.move('character', caretPos)
        range.select()
      }
      else {
        if (elem.selectionStart) {
          elem.focus()
          elem.setSelectionRange(caretPos, caretPos)
        }
        else {
          elem.focus()
        }
      }
    }
  }
  function getInputSelection (el) {
    var start = 0, end = 0, normalizedValue, range,
      textInputRange, len, endRange

    if (typeof el.selectionStart === 'number' && typeof el.selectionEnd === 'number') {
      start = el.selectionStart
      end = el.selectionEnd
    }
    else {
      range = document.selection.createRange()

      if (range && range.parentElement() === el) {
        len = el.value.length
        normalizedValue = el.value.replace(/\r\n/g, '\n')

        // Create a working TextRange that lives only in the input
        textInputRange = el.createTextRange()
        textInputRange.moveToBookmark(range.getBookmark())

        // Check if the start and end of the selection are at the very end
        // of the input, since moveStart/moveEnd doesn't return what we want
        // in those cases
        endRange = el.createTextRange()
        endRange.collapse(false)

        if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
          start = end = len
        }
        else {
          start = -textInputRange.moveStart('character', -len)
          start += normalizedValue.slice(0, start).split('\n').length - 1

          if (textInputRange.compareEndPoints('EndToEnd', endRange) > -1) {
            end = len
          }
          else {
            end = -textInputRange.moveEnd('character', -len)
            end += normalizedValue.slice(0, end).split('\n').length - 1
          }
        }
      }
    }
    return {
      start: start,
      end: end
    }
  }
  import {QField, QInput, QSearch, QAutocomplete} from 'quasar-framework'
  import {AutocompleteController} from './autocomplete-controller'
  const controllerOptions = ['baseUrl', 'minLength', 'params', 'fuzzy', 'stormodtagerpostnumre', 'supplerendebynavn'].reduce((memo) => {
    return memo
  }, {})
  export default {
    name: 'vue-dawa',
    components: {
      QField,
      QInput,
      QSearch,
      QAutocomplete
    },
    props: {
      value: {
        required: false,
        type: String
      },
      placeholder: {
        required: false,
        type: String
      },
      fieldId: {
        required: true,
        type: String
      },
      fieldName: {
        required: true,
        type: String
      },
      label: {
        required: false,
        type: String
      }
    },
    data () {
      return {
        caretpost: 2,
        inputText: this.value ? this.value : '',
        selected: 0,
        focused: false,
        acController: new AutocompleteController(controllerOptions),
        results: [],
        response: {}
      }
    },
    created () {
      this.acController.setInitialRenderCallback(this.handleResults)
      this.acController.setRenderCallback(this.handleResults)
      this.acController.setSelectCallback(this.handleResults)
    },
    methods: {
      generateOneLineAddress (result) {
        let oneLineAddress = ''
        if (result.type === 'vejnavn') {
          oneLineAddress += result['tekst']
        }
        else {
          oneLineAddress += result['data']['vejnavn'] ? result['data']['vejnavn'] + ' ' : ''
          oneLineAddress += result['data']['husnr'] ? result['data']['husnr'] + ', ' : result['data']['vejnavn'] ? ', ' : ''
          oneLineAddress += result['data']['etage'] ? result['data']['etage'] + '. ' : ''
          oneLineAddress += result['data']['dør'] ? result['data']['dør'] + '., ' : result['data']['etage'] ? ', ' : ''
          oneLineAddress += result['data']['supplerendebynavn'] ? result['data']['supplerendebynavn'] + ', ' : ''
          oneLineAddress += result['data']['postnr'] ? result['data']['postnr'] + ' ' : ''
          oneLineAddress += result['data']['postnrnavn'] ? result['data']['postnrnavn'] : ''
        }
        return oneLineAddress
      },
      search (terms, done) {
        done(this.results)
      },
      handleResults (response) {
        this.$set(this, 'results', [])
        let results = []
        if (response.length) {
          for (let item of response) {
            let obj = {
              label: item.tekst,
              value: item.tekst,
              raw: item
            }
            results.push(obj)
          }
        }
        else {
          let obj = {
            label: response.tekst,
            value: response.tekst,
            raw: response
          }
          results.push(obj)
        }
        this.$set(this, 'results', results)
      },
      getCaretChange () {
        return getInputSelection(document.getElementsByName(this.fieldName)[0]).start
      },
      handleInputChange (event) {
        this.inputText = event
        this.caretpos = this.getCaretChange()
        this.acController.update(this.inputText, this.caretpos)
      },
      selectedItem (event) {
        setCaretPosition(this.fieldName, this.caretpos)
        this.caretpos = event.raw.caretpos
        this.acController.update(this.inputText, this.caretpos)
        return this.acController.select(event.raw)
      }
    },
    watch: {
      response (newVal) {
        this.handleResults(newVal)
      }
    }
  }
</script>
