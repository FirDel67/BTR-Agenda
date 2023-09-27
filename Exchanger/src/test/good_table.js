import React, { useRef } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
} from 'react-native';
import { Table, TableWrapper, Cell, Row, Rows, Col } from 'react-native-table-component';

const Separator = (props) =>
    <View style={{ height: '100%', width: 1, backgroundColor: 'grey' }} />

const fields = [
    { key: 'code', title: 'MARCA', width: 200 },
    { key: 'responsable', title: 'RESPONSABLE', width: 150 },
    { key: 'piezas', title: 'PZA', width: 100 },
    { key: 'peso', title: 'KG', width: 100 },
    { key: 'inicio', title: 'INICIO', width: 100 },
    { key: 'termino', title: 'ENTREGA', width: 100 },
    { key: 'hab', title: 'HABILITADO', width: 100 },
    { key: 'arm', title: 'ARMADO', width: 100 },
    { key: 'bar', title: 'BARRENADO', width: 100 },
    { key: 'sol', title: 'SOLDADO', width: 100 },
    { key: 'insp', title: 'LIBERACIÓN', width: 100 },
];

const rows = Array.apply(null, Array(125)).map(
    (item, idx) => ({
        code: idx,
        responsable: `RESPONSABLE-RESPONSABLE-RESPONSABLE-${idx}`,
        piezas: 1,
        peso: idx * 312,
        inicio: '2019-02-01',
        termino: '2019-04-30',
        hab: 0,
        arm: 0,
        bar: 0,
        sol: 0,
        insp: 0,
    })
);

const marks = rows.map(
    row => ([row.code])
);

export default function MyTable() {
    const firstTableRef = useRef(null);
    const lastTableRef = useRef(null);

    const onScroll = (e, target) => {
        target ? target.scrollTo({ y: e.nativeEvent.contentOffset.y }) : undefined;
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <View>
                    <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                        <Cell data={fields[0].title} width={fields[0].width} style={styles.header} textStyle={styles.headerText} />
                    </Table>
                    <View>
                        <ScrollView style={styles.dataWrapper} ref={firstTableRef} onScroll={e => onScroll(e, lastTableRef.current)}>
                            <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                                <Col data={marks} textStyle={styles.text} width={fields[0].width} />
                            </Table>
                        </ScrollView>
                    </View>
                </View>

                <ScrollView horizontal={true}>
                    <View>
                        <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                            <Row data={fields.slice(1).map(field => field.title)} widthArr={fields.slice(1).map(field => field.width)} style={styles.header} textStyle={styles.headerText} />
                        </Table>
                        <View>
                            <ScrollView style={styles.dataWrapper} ref={lastTableRef}>
                                <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                                    <Rows data={rows.map(row => fields.slice(1).map(field => row[field.key]))} textStyle={styles.text} widthArr={fields.slice(1).map(field => field.width)} />
                                </Table>
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: '#212732'
    },
    header: {
        height: 50,
        backgroundColor: '#242b38'
    },
    headerText: {
        textAlign: 'center',
        fontWeight: '100',
        color: 'white',
    },
    text: {
        textAlign: 'center',
        fontWeight: '100',
        color: '#fefefe',
    },
    dataWrapper: {
        marginTop: -1
    },
    row: {
        height: 40,
        backgroundColor: '#2c3445'
    }
});