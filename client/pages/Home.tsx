import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {CardLayout} from '../components/Layouts';
import {Link} from 'react-router';


class HomeStore {

}


export default class Home extends React.Component<{}, {}> {
    store = new HomeStore();
    render() {
        return (
            <DocumentTitle title="Home | Tomatoes Together">
                <CardLayout>
                    <h1>Tomatoes Together</h1>


                </CardLayout>
            </DocumentTitle>
        );
    }
}
