import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import {observer, inject} from 'mobx-react';
import {Link} from 'react-router';
import {Task} from '../models';


@observer
export default class Calendar extends React.Component<{}, {}> {
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h1>Calendar</h1>
                    <table className="table table-condensed">
                        <thead>
                        </thead>
                        <tbody>
                        {([
                            [1,2,3,4,5,6,7],
                            [8,9,10,11,12,13,14],
                            [15,16,17,18,19,20,21],
                            [22,23,24,25,26,27,28],
                            [29,30,31,1,2,3,4],
                        ].map((row) =>
                            <tr>
                                {row.map((day) => <td>{day}</td>)}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}



