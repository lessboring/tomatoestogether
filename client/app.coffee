m = require('mithril')
{header, footer} = require('client/components/simple')

module.exports = types.checkModule
    header_: ['Html']
    header: ->
        m '.header.clearfix.mbl',
            m '.container',
                m '.row',
                    m '.col-sm-6.col-md-8.col-lg-6',
                        m 'h1', 'Tomatoes Together!'
                    m '.col-sm-6.col-md-4.col-lg-6',
                        m 'p', 'Working by yourself can lead to a lack of motivation. But working around others can be distracting.  So do 25 minutes of focused work, and then take a 5 minute break to tell everyone about how it went!  Work periods start on the hour and half past the hour.'

    footer_: ['Html']
    footer: ->
        m '#footer',
            m '.container.text-muted',
                'An experiment by'
                m 'a[href=https://twitter.com/davidscolgan]', '@davidscolgan'

components = types.checkModule
configBar =
    view_: ['Ctrl', {user: 'User', playSound: 'Boolean'}, 'Html']
    view: (ctrl, {user}) ->
        m '.row.mbl',
            m '.col-xs-5',
                m '.input-group',
                    m 'span.input-group-addon', 'Chat Name'
                    m 'input.form-control[type=text][name=nickname]',
                        style:
                            color: user.color
                        user.nickname
            m '.col-xs-5',
                m '.input-group',
                    m 'span.input-group-addon', 'Chat Color'
                    m 'input.form-control[type=text][name=userColor]',
                        user.color
            m '.col-xs-2',
                m 'label.btn.btn-block.btn-default'
                    m 'input[type=checkbox]',
                        display: 'none'
                        checked: playSound
                    m 'i.glyphicon' + (if playSound then '.glyphicon-volume-up' else '.glyphicon-volume-off')

tomatoTimer = (ctrl) ->
    <div data-bind="css: clockBreakTime">
        vm.clockBreakTime = ko.computed ->
            if vm.state() == 'break' then 'clock break' else 'clock work'
        <h2 data-bind="text: clockHeaderMessage">Tomato Time!</h2>
        <div data-bind="text: formattedTime" class="clock-face"></div>
        <div data-bind="visible: nextTomatoTask() === '', html: clockInnerHTML">
        </div>
        <div data-bind="if: nextTomatoTask() !== ''">
            <p data-bind="text: clockInnerText"></p>
            <h3 data-bind="text: nextTomatoTask"></h3>
        </div>
    </div>

tomatoTaskInput = (ctrl) ->
    <form data-bind="submit: joinNextTomato" class="input-group mbl">
        <input placeholder="During this tomato I am going to..." type="text" name="nextTomatoTask" data-bind="value: nextTomatoTaskInput, valueUpdate: 'keyup'" class="form-control"><span class="input-group-btn">
            <button type="submit" class="btn btn-success">Join</button></span>
    </form>

completedTomatosList = (ctrl) ->
    '''
    <!-- ko if: doneTomatoes().length > 0-->
    <h3>Today's Completed Tomatoes</h3>
    <div data-bind="foreach: todaysTomatoes" class="done-tomato-container clearfix">
        <div rel="tooltip" data-toggle="tooltip" data-placement="top" data-bind="text: $index() + 1, attr: { title: task }" class="done-tomato"></div>
    </div>
    <!-- /ko-->
    '''

otherConnectedUsersList_: [['User'], 'Html']
otherConnectedUsersList = (users) ->
    m 'h3', 'Fellow Tomatoers'
    for user in users
        m 'p',
            style:
                color: user.color
            user.nickname

chatBox = (ctrl) ->
    m 'h2',
        style:
            margin: 0
            marginBottom: '21px'
        'Tell everyone about your work:'
    <div data-bind="template: { name: messageTemplateToUse, foreach: chatMessages }" class="well chat-container">
        <div class="chat-message">
            <span data-bind="text: timestamp.toLocaleTimeString()"></span>
            &nbsp;
            <a href="#">
                <strong data-bind="text: nick, style: { color: userColor }">
                </strong>
            </a>:&nbsp;&nbsp;<span data-bind="html: body"></span>
        </div>
        <div class="chat-message">
            <span data-bind="html: body"></span>
            <!-- style="color: red" -->
        </div>
    </div>
    m 'form',
        onsubmit: sendMessage
        m '.input-group',
            m 'input.new-chat-message.form-control[type="text"]',
                data-bind="value: newChatMessage, enable: chatEnabled()"
            m 'span.input-group-btn'
                m 'button.btn.btn-primary[type=submit]',
                    data-bind="enable: chatEnabled()" class="">
                    'Chat'

module.exports = types.checkModule
    controller: ->
    view: (ctrl, args) ->
        m '#wrap',
            header()
            body(ctrl)
            footer()
