import { AnimatedModal } from 'react-native-modal-animated'
      <View style={styles.container}>

        <TouchableOpacity
          onPress={() => {
            this.setState({ modalVisible: true });
            alert
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Show Modal</Text>
        </TouchableOpacity>


        <AnimatedModal
          visible={this.state.modalVisible}
          onBackdropPress={() => {
            this.setState({ modalVisible: false });
          }}
          animationType="vertical"
          duration={600}
        >
          {/*Any child can be used here */}
          <View style={styles.modalCard}>
            <Text>I'm AnimatedModal</Text>
            <Text style={{fontWeight: 'bold', marginTop: 10}}>vertical</Text>
          </View>
        </AnimatedModal>
      </View>
    